import { MdcDatepickerDialogConfiguration } from './mdc-datepicker-dialog/mdc-datepicker-dialog-configuration';
import { AppTask, IAttrMapper, IContainer, NodeObserverLocator } from 'aurelia';
import { MdcDatepicker } from './mdc-datepicker/mdc-datepicker';
import { MdcDatepickerDialog } from './mdc-datepicker-dialog/mdc-datepicker-dialog';

export { MdcDatepickerDialogConfiguration };
export { MdcDatepickerDialog } from './mdc-datepicker-dialog/mdc-datepicker-dialog';
export { MdcDatepicker, IMdcDatepickerElement } from './mdc-datepicker/mdc-datepicker';
export { IMdcDatepickerDialogData, IMdcDatepickerDialogOptions } from './mdc-datepicker-dialog/i-mdc-datepicker-dialog-options';

let registered = false;

export const DatePickerConfiguration = {
  register(container: IContainer): IContainer {
    if (registered) {
      return container;
    } else {
      registered = true;
      AppTask.creating(IContainer, c => {
        const attrMapper = c.get(IAttrMapper);
        const nodeObserverLocator = c.get(NodeObserverLocator);
        attrMapper.useTwoWay((el, property) => el.tagName === 'MDC-DATEPICKER' ? property === 'value' : false);
        nodeObserverLocator.useConfig('MDC-DATEPICKER', 'value', { events: ['input', 'change'] });
      }).register(container);
      return container.register(MdcDatepicker, MdcDatepickerDialog);
    }
  },
  customize(optionsProvider: (config: MdcDatepickerDialogConfiguration) => void) {
    return {
      register(container: IContainer): IContainer {
        const options = container.get(MdcDatepickerDialogConfiguration);
        optionsProvider(options);
        return DatePickerConfiguration.register(container);
      },
    };
  }
};
