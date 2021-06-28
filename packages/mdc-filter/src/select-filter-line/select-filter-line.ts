import { FilterLineBase } from '../filter-line-base';
import { customElement, bindable, useView, PLATFORM } from 'aurelia-framework';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';

@customElement('select-filter-line')
@useView(PLATFORM.moduleName('./select-filter-line.html'))
export class SelectFilterLine extends FilterLineBase<unknown> {
  constructor(element: Element, config: MdcFilterConfiguration) {
    super(element);
    this.operators = config.selectOperators;
  }

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
}
