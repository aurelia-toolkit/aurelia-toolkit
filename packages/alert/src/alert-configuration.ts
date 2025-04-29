import { AlertModal } from './alert-modal/alert-modal';
import { PromptDialog } from './prompt-dialog/prompt-dialog';

export class AlertConfiguration {
  defaultAlertModal: new (...args: any[]) => any = AlertModal;
  defaultPromptDialog: new (...args: any[]) => any = PromptDialog;
}
