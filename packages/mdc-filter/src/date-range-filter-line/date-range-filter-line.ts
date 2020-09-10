import { customElement, useView, PLATFORM } from 'aurelia-framework';
import { FilterLineBase } from '../filter-line-base';
import { FilterOperator } from '../filter-operator';

export interface IDateRange {
  from: Date;
  to: Date;
}

@customElement('date-range-filter-line')
@useView(PLATFORM.moduleName('./date-range-filter-line.html'))
export class DateRangeFilterLine extends FilterLineBase<IDateRange> {
  constructor(element: Element) {
    super(element);
    this.operators = [FilterOperator.Between];
    this.maxWidth = 200;
  }
}
