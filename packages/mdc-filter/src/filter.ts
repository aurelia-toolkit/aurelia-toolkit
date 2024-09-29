import { IFilterLine } from './i-filter-line';
import template from './filter.html?raw';
import { CustomElement, IAurelia, bindable, children, customElement, inject } from 'aurelia';
import { booleanAttr } from '@aurelia-mdc-web/base';

@inject(Element, IAurelia)
@customElement({ name: 'mdc-filter', template })
export class MdcFilter {
  constructor(private element: Element, private au: IAurelia) { }

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
    const line = document.createElement(i.element.tagName.toLowerCase());
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
    this.au.enhance({ component: {}, host: line });
    const filterVm = CustomElement.for<IFilterLine>(line).viewModel;

    filterVm.hydrate(i);
    this.itemsCollection.appendChild(line);
    this.lines.push(filterVm);
    this.element.dispatchEvent(new CustomEvent('added'));
    return filterVm;
  }

  remove(i: IFilterLine) {
    this.lines.splice(this.lines.indexOf(i), 1);
    const line = i.element as unknown as HTMLElement;
    this.itemsCollection.removeChild(line);
    CustomElement.for<IFilterLine>(line).dispose();
    // const containerView = line.au.controller.view;
    // containerView.detached();
    // containerView.unbind();
    // containerView.removeNodes();
    this.element.dispatchEvent(new CustomEvent('removed'));
  }

  detached() {
    while (this.lines.length) {
      this.remove(this.lines[0]);
    }
  }
}
