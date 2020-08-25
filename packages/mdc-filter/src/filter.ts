import { customElement, TemplatingEngine, children, DOM, bindingMode, useView, PLATFORM } from 'aurelia-framework';
import { IFilterLine } from './i-filter-line';
import { FilterLineContainerElement } from './filter-line-container/filter-line-container';
import { bindable } from 'aurelia-typed-observable-plugin';
import { FilterLineElement } from './filter-line-base';

@customElement('filter')
@useView(PLATFORM.moduleName('./filter.html'))
export class MdcFilter {
  constructor(private element: Element, private templatingEngine: TemplatingEngine) { }

  itemsCollection: HTMLDivElement;

  @children('.filter__line')
  availableFilterLines: IFilterLine[];

  @bindable
  pageSizes: number[];

  @bindable.number({ defaultBindingMode: bindingMode.twoWay })
  pageSize: number;

  @bindable
  lines: IFilterLine[] = [];

  @bindable.booleanAttr
  lock: boolean;

  attached() {
    if (this.lines.length) {
      // remove prepopulated filters and add back via adding filter elements
      const lines = [...this.lines];
      this.lines.splice(0);
      lines.forEach(x => {
        const fl = this.availableFilterLines.find(l => l.name === x.name);
        if (fl) {
          const newFilter = this.add(fl);
          newFilter.operator = x.operator;
          newFilter.value = x.value;
        }
      });
    } else {
      this.availableFilterLines.filter(x => x.element.hasAttribute('default')).forEach(x => this.add(x));
    }
  }

  add(i: IFilterLine): IFilterLine {
    const container = DOM.createElement('filter-line-container') as FilterLineContainerElement;
    container.setAttribute('remove.trigger', 'remove($event.detail.filterLine)');
    if (this.lock) {
      container.setAttribute('lock', '');
    }
    const line = DOM.createElement(i.element.tagName.toLowerCase()) as FilterLineElement;
    const content = i.element.getAttribute('content');
    if (content) {
      line.innerHTML = content;
    }
    if (i.element.hasAttribute('two-line')) {
      line.setAttribute('two-line', 'two-line');
    }
    container.appendChild(line);
    const view = this.templatingEngine.enhance(container);
    const filterVm = line.au.controller.viewModel;
    const containerVm = container.au.controller.viewModel;
    containerVm.filterLine = filterVm;

    i.hydrate(filterVm);
    view.bind(this);
    view.attached();
    this.itemsCollection.appendChild(container);
    this.lines.push(filterVm);
    this.element.dispatchEvent(new CustomEvent('added'));
    return filterVm;
  }

  remove(i: IFilterLine) {
    this.lines.splice(this.lines.indexOf(i), 1);
    const container = i.element.parentElement!.parentElement as FilterLineContainerElement;
    this.itemsCollection.removeChild(container);
    const containerView = container.au.controller.view;
    containerView.detached();
    containerView.unbind();
    containerView.removeNodes();
    this.element.dispatchEvent(new CustomEvent('removed'));
  }
}
