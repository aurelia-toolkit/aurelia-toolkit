import { bindable, customElement } from 'aurelia-framework';
import { Filter } from '@aurelia-toolkit/mdc-filter';

@customElement('filter-actions')
export class FilterActions {
  constructor(private element: Element) { }

  @bindable
  filterVm: Filter;

  search() {
    this.element.dispatchEvent(new CustomEvent('search', { bubbles: true }));
  }
}
