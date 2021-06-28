import { customElement, useView, PLATFORM } from 'aurelia-framework';
import { FilterLineBase } from '../filter-line-base';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';

@customElement('date-filter-line')
@useView(PLATFORM.moduleName('./date-filter-line.html'))
export class DateFilterLine extends FilterLineBase<Date> {
  constructor(element: Element, config: MdcFilterConfiguration) {
    super(element);
    this.operators = config.dateOperators;
    this.operator = this.operators[0];
    this.maxWidth = 200;
  }
}
