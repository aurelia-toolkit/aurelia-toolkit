import { customElement, useView, PLATFORM, bindable, inject } from 'aurelia-framework';
import { ISettingInfo } from '../i-setting-info';
import { ClientEditor } from '../client-editor';

@inject(Element)
@customElement('setting-value')
@useView(PLATFORM.moduleName('./setting-value.html'))
export class SettingValue {
  constructor(private element: Element) { }

  @bindable
  setting: ISettingInfo;

  ClientEditor = ClientEditor;

  edit() {
    this.element.dispatchEvent(new CustomEvent('edit-setting', { bubbles: true, detail: { setting: this.setting } }));
  }
}
