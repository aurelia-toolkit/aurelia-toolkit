import { IMdcDatepickerElement } from '@aurelia-toolkit/mdc-datepicker';
import { FilterLineBase } from '../filter-line-base';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';
import template from './date-range-filter-line.html?raw';
import { customElement } from 'aurelia';

export interface IDateRange {
  from: Date;
  to: Date;
}

@customElement({ name: 'date-range-filter-line', template })
export class DateRangeFilterLine extends FilterLineBase<IDateRange> {
  constructor(element: Element, config: MdcFilterConfiguration) {
    super(element);
    this.operators = [...config.dateOperators];
    this.maxWidth = 200;
  }

  fromInput: IMdcDatepickerElement;
  toInput: IMdcDatepickerElement;

  override errorChanged() {
    this.fromInput.valid = !this.error;
    this.toInput.valid = !this.error;
  }

}
