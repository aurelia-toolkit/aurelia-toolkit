import { customElement, useView, PLATFORM } from 'aurelia-framework';
import { bindable } from 'aurelia-typed-observable-plugin';

@customElement('global-progress')
@useView(PLATFORM.moduleName('./global-progress.html'))
export class GlobalProgress {
  constructor(private element: Element) { }

  @bindable.number
  size: number = 100;

  @bindable.number
  strokeWidth: number = 10;

  @bindable.number
  progress?: number;

  @bindable
  text?: string;

  @bindable
  allowCancel: boolean | string;

  cancel() {
    this.element.dispatchEvent(new CustomEvent('global-progress:cancel', { bubbles: true }));
  }
}
