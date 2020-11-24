import { IMdcDatepickerDialogOptions } from './i-mdc-datepicker-dialog-options';

export class MdcDatepickerDialogConfiguration {
  defaultOptions: Partial<IMdcDatepickerDialogOptions> = {
    label: 'Select Date',
    yearRange: 10,
    format: 'E, MMM d',
    firstDay: 0,
    i18n: {
      cancel: 'Cancel',
      ok: 'Ok'
    }
  };
}
