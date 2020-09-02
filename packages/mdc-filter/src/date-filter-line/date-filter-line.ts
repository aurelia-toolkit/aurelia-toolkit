import { customElement, useView, PLATFORM } from 'aurelia-framework';
import { FilterLineBase } from '../filter-line-base';
import { FilterOperator } from '../filter-operator';

@customElement('date-filter-line')
@useView(PLATFORM.moduleName('./date-filter-line.html'))
export class DateFilterLine extends FilterLineBase<Date> {
  constructor(element: Element) {
    super(element);
    this.operators = [FilterOperator.Is, FilterOperator.IsNot, FilterOperator.IsBefore, FilterOperator.IsAfter];
    this.maxWidth = 200;
  }
}
