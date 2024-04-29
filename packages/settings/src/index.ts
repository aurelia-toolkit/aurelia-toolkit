import { IContainer } from 'aurelia';
import { EditSettingModal } from './edit-setting-modal/edit-setting-modal';
import { SettingValue } from './setting-value/setting-value';
import { I18nConfiguration } from '@aurelia/i18n';

export { EditSettingModal } from './edit-setting-modal/edit-setting-modal';
export { I18NResource } from './i-18n-resource';

let registered = false;

export const SettingsConfiguration = {
  register(container: IContainer): IContainer {
    if (registered) {
      return container;
    } else {
      registered = true;
      return container.register(EditSettingModal, SettingValue, I18nConfiguration.customize(o => {
        o.initOptions = {
          resources: {
            en: {
              'aurelia-toolkit': {
                settings: {
                  'edit-setting-modal': {
                    cancel: 'Cancel',
                    save: 'Save'
                  }
                }
              }
            }
          }
        };
      }));
    }
  }
};
