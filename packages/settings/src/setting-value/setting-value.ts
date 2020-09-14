import { customElement, useView, PLATFORM, bindable, inject, computedFrom } from 'aurelia-framework';
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

  @computedFrom('setting.value')
  get selectValue() {
    return this.setting.options?.find(x => x.key === this.setting.value)?.value;
  }

  edit() {
    this.element.dispatchEvent(new CustomEvent('edit-setting', { bubbles: true, detail: { setting: this.setting } }));
  }
}
