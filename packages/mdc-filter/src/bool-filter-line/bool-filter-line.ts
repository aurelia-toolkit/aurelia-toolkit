import { customElement } from 'aurelia';
import { FilterLineBase } from '../filter-line-base';
import template from './bool-filter-line.html?raw';

@customElement({ name: 'bool-filter-line', template })
export class BoolFilterLine extends FilterLineBase<boolean> {
  constructor(element: Element) {
    super(element);
  }
}
