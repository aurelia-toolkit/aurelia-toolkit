import { customElement, useView, PLATFORM } from 'aurelia-framework';
import { FilterLineBase } from '../filter-line-base';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';
import { IMdcDatepickerElement } from '@aurelia-toolkit/mdc-datepicker';

@customElement('date-filter-line')
@useView(PLATFORM.moduleName('./date-filter-line.html'))
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
