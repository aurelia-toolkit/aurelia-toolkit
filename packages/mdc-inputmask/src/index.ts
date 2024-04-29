import { EnhanceMask, MdcInputmaskCustomAttribute } from './mdc-inputmask';
import { IContainer } from 'aurelia';

let registered = false;

export const MdcInputMaskConfiguration = {
  register(container: IContainer): IContainer {
    if (registered) {
      return container;
    } else {
      registered = true;
      return container.register(MdcInputmaskCustomAttribute, EnhanceMask);
    }
  }
};
