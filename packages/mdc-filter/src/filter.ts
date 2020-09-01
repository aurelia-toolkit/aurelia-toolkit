import { customElement, TemplatingEngine, children, DOM, useView, PLATFORM } from 'aurelia-framework';
import { IFilterLine } from './i-filter-line';
import { FilterLineContainerElement } from './filter-line-container/filter-line-container';
import { bindable } from 'aurelia-typed-observable-plugin';
import { FilterLineElement } from './filter-line-base';

@customElement('filter')
@useView(PLATFORM.moduleName('./filter.html'))
export class Filter {
  constructor(private element: Element, private templatingEngine: TemplatingEngine) { }

  itemsCollection: HTMLDivElement;

  @children('.filter__line')
  availableFilterLines: IFilterLine[];

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
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          const line: IFilterLine = {
            label: fl.label, maxWidth: fl.maxWidth, name: fl.name,
            operators: fl.operators, operator: x.operator, value: x.value,
            element: fl.element
          } as IFilterLine;
          this.add(line);
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

    filterVm.hydrate(i);
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
