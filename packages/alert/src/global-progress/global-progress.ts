import { customElement, useView, PLATFORM } from 'aurelia-framework';

@customElement('global-progress')
@useView(PLATFORM.moduleName('./global-progress.html'))
export class GlobalProgress {

}
