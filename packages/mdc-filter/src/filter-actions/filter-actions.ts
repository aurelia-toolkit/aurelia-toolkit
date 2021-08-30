import { bindable, customElement, useView, PLATFORM } from 'aurelia-framework';
import { Filter } from '../filter';
import { MdcMenu } from '@aurelia-mdc-web/menu';

@useView(PLATFORM.moduleName('./filter-actions.html'))
@customElement('filter-actions')
export class FilterActions {
  constructor(private element: Element) { }

  @bindable
  filter: Filter;

  @bindable
  anchorCorner: MdcMenu['anchorCorner'];

  search() {
    this.element.dispatchEvent(new CustomEvent('search', { bubbles: true }));
  }
}
