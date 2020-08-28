import { customElement, useView, PLATFORM } from 'aurelia-framework';

@customElement('at-form-field')
@useView(PLATFORM.moduleName('./at-form-field.html'))
export class AtFormField { }
