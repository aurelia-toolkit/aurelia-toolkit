import { IFilterLine } from './i-filter-line';
import { FilterOperator } from './filter-operator';
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

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  operator?: FilterOperator;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  operators: FilterOperator[];
  operatorsChanged() {
    this.operator = this.operators ? this.operators[0] : undefined;
  }

  @bindable.number({ defaultBindingMode: bindingMode.twoWay })
  maxWidth: number;

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  hydrateInternal(_fl: IFilterLine) { }

  hydrate(fl: IFilterLine) {
    fl.label = this.label;
    fl.name = this.name;
    fl.operators = this.operators;
    fl.operator = this.operator;
    fl.value = this.value;
    fl.maxWidth = this.maxWidth;
    this.hydrateInternal(fl);
  }

  toJson(): Partial<IFilterLine> {
    return { name: this.name, operator: this.operator, value: this.value };
  }
}
