import { MdcFilter } from '../filter';
import { MdcMenu } from '@aurelia-mdc-web/menu';
import template from './filter-actions.html';
import { bindable, customElement } from 'aurelia';

@customElement({ name: 'filter-actions', template })
export class FilterActions {
  constructor(private element: Element) { }

  @bindable
  filter: MdcFilter;

  @bindable
  anchorCorner: MdcMenu['anchorCorner'];

  search() {
    this.element.dispatchEvent(new CustomEvent('search', { bubbles: true }));
  }
}
