import { customElement, useView, PLATFORM } from 'aurelia-framework';

@customElement('at-headered-content')
@useView(PLATFORM.moduleName('./at-headered-content.html'))
export class AtHeaderedContent { }
