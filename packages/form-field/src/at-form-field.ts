import { customElement, useView, PLATFORM, bindable, inject } from 'aurelia-framework';

@inject(Element)
@customElement('at-form-field')
@useView(PLATFORM.moduleName('./at-form-field.html'))
export class AtFormField {
  constructor(private element: HTMLElement) { }

  @bindable
  width: string;
  widthChanged() {
    this.element.style.width = `${this.width}px`;
  }
}
