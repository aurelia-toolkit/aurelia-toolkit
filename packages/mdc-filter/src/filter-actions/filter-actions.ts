import { bindable, customElement } from 'aurelia-framework';
import { Filter } from '../filter';

@customElement('filter-actions')
export class FilterActions {
  constructor(private element: Element) { }

  @bindable
  filter: Filter;

  search() {
    this.element.dispatchEvent(new CustomEvent('search', { bubbles: true }));
  }
}
