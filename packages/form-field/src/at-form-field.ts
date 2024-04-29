import { bindable, customElement, inject } from 'aurelia';
import template from './at-form-field.html';

@inject(Element)
@customElement({ name: 'at-form-field', template })
export class AtFormField {
  constructor(private element: HTMLElement) { }

  @bindable
  width: string;
  widthChanged() {
    this.element.style.width = `${this.width}px`;
  }
}
