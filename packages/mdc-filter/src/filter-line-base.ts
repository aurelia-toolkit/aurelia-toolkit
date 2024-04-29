import { BindingMode, bindable } from 'aurelia';
import { IFilterLine } from './i-filter-line';
import { booleanAttr, number } from '@aurelia-mdc-web/base';

export interface FilterLineElement extends HTMLElement {
  au: {
    controller: { viewModel: IFilterLine };
  };
}

export abstract class FilterLineBase<T> implements IFilterLine {
  constructor(public element: Element) { }

  @bindable
  name: string;

  @bindable({ mode: BindingMode.twoWay })
  label: string;

  @bindable({ mode: BindingMode.twoWay })
  value?: T;
  valueChanged() {
    this.error = undefined;
  }

  @bindable({ mode: BindingMode.twoWay })
  operator?: unknown;

  @bindable({ mode: BindingMode.twoWay })
  operators: unknown[];
  operatorsChanged() {
    this.operator = this.operators
      ? this.operators.some(x => x === this.operator) ? this.operator : this.operators[0]
      : undefined;
  }

  @bindable({ set: number, mode: BindingMode.twoWay })
  maxWidth: number;

  @bindable({ set: booleanAttr })
  lock: boolean;

  @bindable
  error?: string;
  errorChanged() { }

  hydrateInternal(_fl: IFilterLine) { }

  hydrate(fl: FilterLineBase<T>) {
    this.label = fl.label;
    this.name = fl.name;
    this.operators = fl.operators;
    this.operator = fl.operator;
    this.value = fl.value;
    this.maxWidth = fl.maxWidth;
    this.lock = fl.lock;
    this.hydrateInternal(fl);
  }

  toJson(): Partial<IFilterLine> {
    return { name: this.name, operator: this.operator, value: this.value };
  }

  remove() {
    this.element.dispatchEvent(new CustomEvent('remove', { detail: { filterLine: this } }));
  }

  assignValue(fl: FilterLineBase<T>): void {
    this.operator = fl.operator;
    this.value = fl.value;
  }
}
