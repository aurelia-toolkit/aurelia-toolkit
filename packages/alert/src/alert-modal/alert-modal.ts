import { IAlertModalPayload } from './i-alert-modal-payload';
import { autoinject, useView, PLATFORM } from 'aurelia-framework';
import { MdcDialog } from '@aurelia-mdc-web/dialog';

@autoinject
@useView(PLATFORM.moduleName('./alert-modal.html'))
export class AlertModal {
  constructor(private dialog: MdcDialog){
    this.dialog.root.classList.add('alert-modal');
  }

  payload: IAlertModalPayload;

  activate(payload: IAlertModalPayload) {
    this.payload = payload;
  }
}
