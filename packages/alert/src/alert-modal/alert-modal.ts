import { IAlertModalPayload } from './i-alert-modal-payload';
import template from './alert-modal.html'
import { customElement } from 'aurelia';

@customElement({ name: 'alert-modal', template })
export class AlertModal {
  payload: IAlertModalPayload;

  loading(payload: IAlertModalPayload) {
    this.payload = payload;
  }
}
