import { IFilterLine } from './i-filter-line';
import { bindable } from 'aurelia-typed-observable-plugin';
import { bindingMode } from 'aurelia-framework';

export interface FilterLineElement extends HTMLElement {
  au: {
    controller: { viewModel: IFilterLine };
  };
}

export abstract class FilterLineBase<T> implements IFilterLine {
  constructor(public element: Element) { }

  @bindable
  name: string;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  label: string;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  value?: T;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  valueChanged() { }

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  operator?: unknown;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  operators: unknown[];
  operatorsChanged() {
    this.operator = this.operators
      ? this.operators.find(x => x === this.operator) ? this.operator : this.operators[0]
      : undefined;
  }

  @bindable.number({ defaultBindingMode: bindingMode.twoWay })
  maxWidth: number;

  @bindable.booleanAttr
  lock: boolean;

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
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
