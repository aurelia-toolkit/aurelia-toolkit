import { useView, PLATFORM, autoinject } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationRules, ValidationController, Rule } from 'aurelia-validation';
import { MdcDialog } from '@aurelia-mdc-web/dialog';

export interface IPromptDialogData {
  title: string;
  label: string;
  text: string;
  required: boolean;
  textarea: boolean;
  okText: string;
  cancelText: string;
}

@autoinject
@useView(PLATFORM.moduleName('./prompt-dialog.html'))
export class PromptDialog {
  constructor(private validationControllerFactory: ValidationControllerFactory) {
    this.validationController = this.validationControllerFactory.createForCurrentScope();
    this.rules = ValidationRules
      .ensure<IPromptDialogData, string>(x => x.text).required().when(x => x.required)
      .rules;
  }

  dialog: MdcDialog;
  data: IPromptDialogData;
  validationController: ValidationController;
  rules: Rule<IPromptDialogData, unknown>[][];

  activate(data: IPromptDialogData) {
    this.data = data;
    this.validationController.addObject(this.data, this.rules);
  }

  async save() {
    if ((await this.validationController.validate()).valid) {
      this.dialog.close('save');
    }
  }
}
