import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { I18NResource } from './i-18n-resource';
import { Logger } from 'aurelia-logging';

export { AlertService } from './alert-service';
export { I18NResource } from './i-18n-resource';
export { IPromptDialogData } from './prompt-dialog/prompt-dialog';
export { confirmAction } from './decorators/confirm-action';
export { usingProgress } from './decorators/using-progress';
export { ExceptionsTracker } from './exceptions-tracker';
export { IAlertModalPayload } from './alert-modal/i-alert-modal-payload';

export function configure(frameworkConfiguration: FrameworkConfiguration) {
  frameworkConfiguration.globalResources([
    PLATFORM.moduleName('./global-progress/global-progress'),
    PLATFORM.moduleName('./alert-modal/alert-modal'),
    PLATFORM.moduleName('./prompt-dialog/prompt-dialog')
  ]);

  const i18n = frameworkConfiguration.container.get(I18N);
  // i18n might not be initialised yet
  if (i18n.i18nextDeferred) {
    i18n.i18nextDeferred.then(i18next => {
      const alert: I18NResource = {
        cancel: 'Cancel',
        no: 'No',
        ok: 'OK',
        yes: 'Yes'
      };
      i18next.addResourceBundle('en', 'aurelia-toolkit', { alert }, true, false);
    });
  } else {
    const logger = frameworkConfiguration.container.get(Logger);
    logger.error('Did you forget to initialise I18N plugin?');
    throw Error();
  }

}
