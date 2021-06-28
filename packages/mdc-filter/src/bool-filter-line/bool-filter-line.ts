import { FilterLineBase } from '../filter-line-base';
import { customElement, useView, PLATFORM } from 'aurelia-framework';

@customElement('bool-filter-line')
@useView(PLATFORM.moduleName('./bool-filter-line.html'))
export class BoolFilterLine extends FilterLineBase<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(element: Element) {
    super(element);
  }
}
