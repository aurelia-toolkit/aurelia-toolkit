import { ISettingInfo } from '../i-setting-info';
import { ClientEditor } from '../client-editor';
import { customElement } from 'aurelia';
import template from './edit-setting-modal.html?raw';

@customElement({ name: 'edit-setting-modal', template })
export class EditSettingModal {
  setting: ISettingInfo;
  ClientEditor = ClientEditor;

  loading(setting: ISettingInfo) {
    this.setting = setting;
  }
}
