import { FilterLineBase } from '../filter-line-base';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';
import { IMdcTextFieldElement } from '@aurelia-mdc-web/text-field';
import template from './number-filter-line.html?raw';
import { customElement, inject, observable } from 'aurelia';

@inject(Element, MdcFilterConfiguration)
@customElement({ name: 'number-filter-line', template })
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
