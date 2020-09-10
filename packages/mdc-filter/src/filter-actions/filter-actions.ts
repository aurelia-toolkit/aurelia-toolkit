import { bindable, customElement, useView, PLATFORM } from 'aurelia-framework';
import { Filter } from '../filter';

@useView(PLATFORM.moduleName('./filter-actions.html'))
@customElement('filter-actions')
export class FilterActions {
  constructor(private element: Element) { }

  @bindable
  filter: Filter;

  search() {
    this.element.dispatchEvent(new CustomEvent('search', { bubbles: true }));
  }
}
