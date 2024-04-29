import { IFilterLine } from './i-filter-line';
import { FilterLineElement } from './filter-line-base';
import template from './filter.html';
import { bindable, children, customElement } from 'aurelia';
import { booleanAttr } from '@aurelia-mdc-web/base';

@customElement({ name: 'mdc-filter', template })
export class MdcFilter {
  constructor(private element: Element, private templatingEngine: TemplatingEngine) { }

  itemsCollection: HTMLDivElement;

  @children('.filter-line')
  availableFilterLines: IFilterLine[];

  @bindable
  lines: IFilterLine[] = [];

  @bindable({ set: booleanAttr })
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
          newFilter.assignValue(x);
        }
      });
    } else {
      this.availableFilterLines.filter(x => x.element.hasAttribute('default')).forEach(x => this.add(x));
    }
  }

  add(i: IFilterLine): IFilterLine {
    const line = document.createElement(i.element.tagName.toLowerCase()) as FilterLineElement;
    line.setAttribute('remove.trigger', 'remove($event.detail.filterLine)');
    if (this.lock) {
      line.setAttribute('lock', '');
    }
    const content = i.element.getAttribute('content');
    if (content) {
      line.innerHTML = content;
    }
    if (i.element.hasAttribute('two-line')) {
      line.setAttribute('two-line', 'two-line');
    }
    const view = this.templatingEngine.enhance(line);
    const filterVm = line.au.controller.viewModel;

    filterVm.hydrate(i);
    view.bind(this);
    view.attached();
    this.itemsCollection.appendChild(line);
    this.lines.push(filterVm);
    this.element.dispatchEvent(new CustomEvent('added'));
    return filterVm;
  }

  remove(i: IFilterLine) {
    this.lines.splice(this.lines.indexOf(i), 1);
    const line = i.element as unknown as HTMLElement & { au: { controller: Controller } };
    this.itemsCollection.removeChild(line);
    const containerView = line.au.controller.view;
    containerView.detached();
    containerView.unbind();
    containerView.removeNodes();
    this.element.dispatchEvent(new CustomEvent('removed'));
  }

  detached() {
    while (this.lines.length) {
      this.remove(this.lines[0]);
    }
  }
}
