import { IFilterLine } from '../i-filter-line';
import { customElement, useView, PLATFORM, View } from 'aurelia-framework';
import { bindable } from 'aurelia-typed-observable-plugin';

export interface FilterLineContainerElement extends HTMLElement {
  au: {
    controller: {
      view: View;
      viewModel: FilterLineContainer;
    };
  };
}

@customElement('filter-line-container')
@useView(PLATFORM.moduleName('./filter-line-container.html'))
export class FilterLineContainer {
  constructor(private element: Element) { }

  filterLine: IFilterLine;

  @bindable.booleanAttr
  lock: boolean;

  remove() {
    this.element.dispatchEvent(new CustomEvent('remove', { detail: { filterLine: this.filterLine } }));
  }
}
