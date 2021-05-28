import { FilterLineBase } from '../filter-line-base';
import { FilterOperator } from '../filter-operator';
import { customElement, useView, PLATFORM } from 'aurelia-framework';

@customElement('bool-filter-line')
@useView(PLATFORM.moduleName('./bool-filter-line.html'))
export class BoolFilterLine extends FilterLineBase<boolean> {
  constructor(element: Element) {
    super(element);
    this.operators = [FilterOperator.Is];
    this.operator = FilterOperator.Is;
  }
}
