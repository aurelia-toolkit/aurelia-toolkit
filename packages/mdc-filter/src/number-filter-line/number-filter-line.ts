import { FilterLineBase } from '../filter-line-base';
import { customElement, observable, useView, PLATFORM } from 'aurelia-framework';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';
import { IMdcTextFieldElement } from '@aurelia-mdc-web/text-field';

@customElement('number-filter-line')
@useView(PLATFORM.moduleName('./number-filter-line.html'))
export class NumberFilterLine extends FilterLineBase<number> {
  constructor(element: Element, config: MdcFilterConfiguration) {
    super(element);
    this.operators = [...config.numberOperators];
    this.maxWidth = 150;
  }

  input: IMdcTextFieldElement;

  override valueChanged() {
    super.valueChanged();
    this.valueText = (this.value === undefined || isNaN(this.value))
      ? ''
      : this.value.toString();
  }

  @observable
  valueText: string;
  valueTextChanged() {
    this.value = parseFloat(this.valueText);
  }

  override errorChanged() {
    this.input.valid = !this.error;
  }
}
