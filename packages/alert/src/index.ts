import { IContainer } from 'aurelia';
import { AlertModal } from './alert-modal/alert-modal';
import { GlobalProgress } from './global-progress/global-progress';
import { PromptDialog } from './prompt-dialog/prompt-dialog';
import { I18nConfiguration } from '@aurelia/i18n';

export { AlertService } from './alert-service';
export { I18NResource } from './i-18n-resource';
export { IPromptDialogData } from './prompt-dialog/prompt-dialog';
export { confirmAction } from './decorators/confirm-action';
export { usingProgress } from './decorators/using-progress';
export { ExceptionsTracker } from './exceptions-tracker';
export { IAlertModalPayload } from './alert-modal/i-alert-modal-payload';
export { IWithAlertService } from './decorators/using-progress';

let registered = false;

export const AlertConfiguration = {
  register(container: IContainer): IContainer {
    if (registered) {
      return container;
    } else {
      registered = true;
      return container.register(AlertModal, GlobalProgress, PromptDialog, I18nConfiguration.customize(o => {
        o.initOptions = {
          resources: {
            en: {
              'aurelia-toolkit': {
                alert: {
                  cancel: 'Cancel',
                  no: 'No',
                  ok: 'OK',
                  yes: 'Yes'
                }
              }
            }
          }
        };
      }));
    }
  }
};
