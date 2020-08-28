import { autoinject, useView, PLATFORM } from 'aurelia-framework';
import { ISettingInfo } from '../i-setting-info';
import { ClientEditor } from '../client-editor';

@autoinject
@useView(PLATFORM.moduleName('./edit-setting-modal.html'))
export class EditSettingModal {
  setting: ISettingInfo;
  ClientEditor = ClientEditor;

  activate(setting: ISettingInfo) {
    this.setting = setting;
  }
}
