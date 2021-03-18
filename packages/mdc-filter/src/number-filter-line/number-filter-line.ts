import { FilterLineBase } from '../filter-line-base';
import { FilterOperator } from '../filter-operator';
import { customElement, observable, useView, PLATFORM } from 'aurelia-framework';

@customElement('number-filter-line')
@useView(PLATFORM.moduleName('./number-filter-line.html'))
export class NumberFilterLine extends FilterLineBase<number> {
  constructor(element: Element) {
    super(element);
    this.operators = [FilterOperator.Is, FilterOperator.IsNot, FilterOperator.GreaterThan, FilterOperator.LessThan];
    this.maxWidth = 150;
  }

  valueChanged() {
    this.valueText = (this.value === undefined || isNaN(this.value))
      ? ''
      : this.value.toString();
  }

  @observable
  valueText: string;
  valueTextChanged() {
    this.value = parseFloat(this.valueText);
  }
}
