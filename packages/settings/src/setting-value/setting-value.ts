import { ISettingInfo } from '../i-setting-info';
import { ClientEditor } from '../client-editor';
import template from './setting-value.html?raw';
import { bindable, customElement, inject } from 'aurelia';

@inject(Element)
@customElement({ name: 'setting-value', template })
export class SettingValue {
  constructor(private element: Element) { }

  @bindable
  setting: ISettingInfo;

  ClientEditor = ClientEditor;

  get selectValue() {
    return this.setting.options?.find(x => x.key === this.setting.value)?.value;
  }

  edit() {
    this.element.dispatchEvent(new CustomEvent('edit-setting', { bubbles: true, detail: { setting: this.setting } }));
  }
}
