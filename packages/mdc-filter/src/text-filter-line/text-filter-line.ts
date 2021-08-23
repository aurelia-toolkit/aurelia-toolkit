import { FilterLineBase } from '../filter-line-base';
import { customElement, useView, PLATFORM } from 'aurelia-framework';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';
import { IMdcTextFieldElement } from '@aurelia-mdc-web/text-field';

@customElement('text-filter-line')
@useView(PLATFORM.moduleName('./text-filter-line.html'))
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
