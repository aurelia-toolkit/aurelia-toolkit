import { FilterLineBase } from '../filter-line-base';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';
import { IMdcSelectElement } from '@aurelia-mdc-web/select';
import template from './select-filter-line.html?raw';
import { bindable, customElement, inject } from 'aurelia';

@inject(Element, MdcFilterConfiguration)
@customElement({ name: 'select-filter-line', template })
export class SelectFilterLine extends FilterLineBase<unknown> {
  constructor(element: Element, config: MdcFilterConfiguration) {
    super(element);
    this.operators = [...config.selectOperators];
  }

  select: IMdcSelectElement;

  @bindable
  options: unknown[];

  @bindable
  displayField: ((option: unknown) => string) | string | undefined;

  @bindable
  valueField: ((option: unknown) => unknown) | string | undefined;

  hydrateInternal(fl: SelectFilterLine) {
    this.options = fl.options;
    this.displayField = fl.displayField;
    this.valueField = fl.valueField;
  }

  getDisplay(option: Record<string, unknown>): unknown {
    if (!this.displayField) {
      return option;
    } else if (this.displayField instanceof Function) {
      return this.displayField(option);
    } else {
      return option[this.displayField];
    }
  }

  getValue(option: Record<string, unknown>): unknown {
    if (!this.valueField) {
      return option;
    } else if (this.valueField instanceof Function) {
      return this.valueField(option);
    } else {
      return option[this.valueField];
    }
  }

  override errorChanged() {
    this.select.valid = !this.error;
  }
}
