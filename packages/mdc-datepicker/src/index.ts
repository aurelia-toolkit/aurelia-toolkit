import { FrameworkConfiguration, PLATFORM, bindingMode, ValueAttributeObserver, EventSubscriber } from 'aurelia-framework';
import { MdcComponentAdapters } from '@aurelia-mdc-web/base';
import { MdcDatepickerDialogConfiguration } from './mdc-datepicker-dialog/mdc-datepicker-dialog-configuration';

export { MdcDatepickerDialogConfiguration };
export { MdcDatepickerDialog } from './mdc-datepicker-dialog/mdc-datepicker-dialog';
export { MdcDatepicker } from './mdc-datepicker/mdc-datepicker';
export { IMdcDatepickerDialogData, IMdcDatepickerDialogOptions } from './mdc-datepicker-dialog/i-mdc-datepicker-dialog-options';

export function configure(frameworkConfiguration: FrameworkConfiguration, callback?: (config: MdcDatepickerDialogConfiguration) => void) {
  frameworkConfiguration.container.get(MdcComponentAdapters).registerMdcElementConfig(datepickerConfig);

  frameworkConfiguration.globalResources([
    PLATFORM.moduleName('./mdc-datepicker/mdc-datepicker'),
    PLATFORM.moduleName('./mdc-datepicker-dialog/mdc-datepicker-dialog')
  ]);

  frameworkConfiguration.aurelia
    .use
    .plugin(PLATFORM.moduleName('@aurelia-mdc-web/dialog'))
    .plugin(PLATFORM.moduleName('@aurelia-mdc-web/list'))
    .plugin(PLATFORM.moduleName('@aurelia-mdc-web/select'))
    .plugin(PLATFORM.moduleName('@aurelia-mdc-web/text-field'));

  if (typeof callback === 'function') {
    const config = frameworkConfiguration.container.get(MdcDatepickerDialogConfiguration);
    callback(config);
  }

}

const datepickerConfig = {
  tagName: 'mdc-datepicker',
  properties: {
    value: {
      defaultBindingMode: bindingMode.twoWay,
      getObserver(element: Element) {
        return new ValueAttributeObserver(element, 'value', new EventSubscriber(['change', 'input']));
      }
    }
  }
};
