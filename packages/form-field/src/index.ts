import { IContainer } from 'aurelia';
import { AtFormField } from './at-form-field';

let registered = false;

export const FormFieldConfiguration = {
  register(container: IContainer): IContainer {
    if (registered) {
      return container;
    } else {
      registered = true;
      return container.register(AtFormField);
    }
  }
};
