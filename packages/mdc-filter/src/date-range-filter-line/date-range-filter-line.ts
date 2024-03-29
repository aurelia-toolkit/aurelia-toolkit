import { IMdcDatepickerElement } from '@aurelia-toolkit/mdc-datepicker';
import { customElement, useView, PLATFORM } from 'aurelia-framework';
import { FilterLineBase } from '../filter-line-base';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';

export interface IDateRange {
  from: Date;
  to: Date;
}

@customElement('date-range-filter-line')
@useView(PLATFORM.moduleName('./date-range-filter-line.html'))
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
