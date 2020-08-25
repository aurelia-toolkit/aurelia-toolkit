import { customElement, useView, bindable, bindingMode, PLATFORM } from 'aurelia-framework';
import parse from 'date-fns/parse';
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

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  valueDate: string;

  updateDateValue() {
    this.value = this.valueDate !== undefined ? parse(this.valueDate, 'yyyy-MM-dd', new Date()) : undefined;
  }
}
