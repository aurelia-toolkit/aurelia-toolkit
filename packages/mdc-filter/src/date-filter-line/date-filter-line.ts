import { FilterLineBase } from '../filter-line-base';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';
import { IMdcDatepickerElement } from '@aurelia-toolkit/mdc-datepicker';
import template from './date-filter-line.html?raw';
import { customElement } from 'aurelia';

@customElement({ name: 'date-filter-line', template })
export class DateFilterLine extends FilterLineBase<Date> {
  constructor(element: Element, config: MdcFilterConfiguration) {
    super(element);
    this.operators = [...config.dateOperators];
    this.maxWidth = 200;
  }

  input: IMdcDatepickerElement;

  override errorChanged() {
    this.input.valid = !this.error;
  }

}
