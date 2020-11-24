import { useView, PLATFORM } from 'aurelia-framework';
import format from 'date-fns/format';
import startOfDay from 'date-fns/startOfDay';
import { MdcDialog } from '@aurelia-mdc-web/dialog';
import { IMdcDatepickerDialogOptions, IMdcDatepickerDialogData } from './i-mdc-datepicker-dialog-options';
import { MdcDatepickerDialogConfiguration } from './mdc-datepicker-dialog-configuration';
import { isWeekend, addDays, isSameMonth } from 'date-fns';

interface IDay {
  date?: Date | null;
  disabled: boolean;
}

@useView(PLATFORM.moduleName('./mdc-datepicker-dialog.html'))
export class MdcDatepickerDialog {
  constructor(private dialog: MdcDialog, private configuration: MdcDatepickerDialogConfiguration) { }

  months: string[];

  month: number;
  years: number[];
  year: number;
  weekDays: string[];
  date?: Date | null;
  originalData: Partial<IMdcDatepickerDialogData>;
  options: Partial<IMdcDatepickerDialogOptions>;
  days: IDay[];

  activate(data: Partial<IMdcDatepickerDialogData>) {
    this.originalData = data ?? {};
    this.options = { ...this.configuration.defaultOptions, ...data?.options };
    this.options.i18n = { ...this.configuration.defaultOptions.i18n, ...data?.options?.i18n };
    this.months = Array.from({ length: 12 }, (_, i) => format(new Date(2020, i + 1, 1), 'LLLL', { locale: this.options?.i18n?.dateFnsLocale }));
    this.weekDays = Array.from({ length: 7 }, (_, i) => format(new Date(2020, 10, 16 + i - 1 + this.options.firstDay!), 'EEE', { locale: this.options?.i18n?.dateFnsLocale }));
    this.date = startOfDay(data.date ?? new Date());
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();
    this.buildDates();
  }

  buildDates() {
    const [min, max] = typeof (this.options.yearRange) === 'number'
      ? [this.year - this.options.yearRange, this.year + this.options.yearRange]
      : [this.options.yearRange!.min, this.options.yearRange!.max];
    this.years = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    const first = new Date(this.year, this.month, 1);
    const offset = this.weekDays.indexOf(format(first, 'EEE', { locale: this.options?.i18n?.dateFnsLocale }));
    this.days = Array.from({ length: 42 }, (_, i) => {
      const date = addDays(first, i - offset);
      const sameMonth = isSameMonth(first, date);
      return {
        date: this.options.showAll || sameMonth ? date : null,
        disabled: this.isDisabled(date, sameMonth)
      };
    });
    const currentDate = this.days.find(x => x?.date?.getTime() === this.date!.getTime());
    if (!currentDate?.disabled) {
      this.date = currentDate!.date;
    }
  }

  isDisabled(date: Date, sameMonth: boolean): boolean {
    return !sameMonth
      || this.options.min && this.options.min > date
      || this.options.max && this.options.max < date
      || this.options.disableFunction?.(date)
      || this.options.disableWeekends! && isWeekend(date);
  }

  monthSelected(month: number) {
    this.month = month;
  }

  select(d: IDay) {
    if (d.disabled) {
      return;
    }
    this.date = d.date;
  }

  ok() {
    this.originalData.date = this.date;
    this.dialog.close('ok');
  }
}
