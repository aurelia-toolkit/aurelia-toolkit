import { FilterLineBase } from '../filter-line-base';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';
import { IMdcTextFieldElement } from '@aurelia-mdc-web/text-field';
import template from './text-filter-line.html';
import { customElement, inject } from 'aurelia';

@inject(Element, MdcFilterConfiguration)
@customElement({ name: 'text-filter-line', template })
export class TextFilterLine extends FilterLineBase<string> {
  constructor(element: Element, config: MdcFilterConfiguration) {
    super(element);
    this.operators = [...config.textOperators];
  }

  input: IMdcTextFieldElement;

  override errorChanged() {
    this.input.valid = !this.error;
  }
}
