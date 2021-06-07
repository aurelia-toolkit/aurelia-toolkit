import { IAlertModalPayload } from './i-alert-modal-payload';
import { autoinject, useView, PLATFORM } from 'aurelia-framework';

@autoinject
@useView(PLATFORM.moduleName('./alert-modal.html'))
export class AlertModal {
  payload: IAlertModalPayload;

  activate(payload: IAlertModalPayload) {
    this.payload = payload;
  }
}
