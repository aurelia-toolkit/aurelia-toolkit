import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Logger } from 'aurelia-logging';
import { I18NResource } from './i-18n-resource';

export { EditSettingModal } from './edit-setting-modal/edit-setting-modal';

export function configure(frameworkConfiguration: FrameworkConfiguration) {
  frameworkConfiguration.globalResources([
    PLATFORM.moduleName('./edit-setting-modal/edit-setting-modal'),
    PLATFORM.moduleName('./setting-value/setting-value')
  ]);

  const i18n = frameworkConfiguration.container.get(I18N);
  // i18n might not be initialised yet
  if (i18n.i18nextDeferred) {
    i18n.i18nextDeferred.then(i18next => {
      const defaultResource: I18NResource = {
        'edit-setting-modal': {
          cancel: 'Cancel',
          save: 'Save'
        }
      };
      i18next.addResourceBundle('en', 'aurelia-toolkit', defaultResource, true, false);
    });
  } else {
    const logger = frameworkConfiguration.container.get(Logger);
    logger.error('Did you forget to initialise I18N plugin?');
    throw Error();
  }
}
