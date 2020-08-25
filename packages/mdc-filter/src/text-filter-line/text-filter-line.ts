import { FilterLineBase } from '../filter-line-base';
import { FilterOperator } from '../filter-operator';
import { customElement, useView, PLATFORM } from 'aurelia-framework';

@customElement('text-filter-line')
@useView(PLATFORM.moduleName('./text-filter-line.html'))
export class TextFilterLine extends FilterLineBase<string> {
  constructor(element: Element) {
    super(element);
    this.operators = [FilterOperator.Like, FilterOperator.NotLike];
  }
}
