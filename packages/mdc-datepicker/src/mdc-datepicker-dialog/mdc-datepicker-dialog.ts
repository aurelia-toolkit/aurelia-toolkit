import { useView, PLATFORM, computedFrom } from 'aurelia-framework';
import format from 'date-fns/format';
import isWeekend from 'date-fns/isWeekend';
import addDays from 'date-fns/addDays';
import isSameMonth from 'date-fns/isSameMonth';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import startOfDay from 'date-fns/startOfDay';
import { MdcDialog } from '@aurelia-mdc-web/dialog';
import { IMdcDatepickerDialogOptions, IMdcDatepickerDialogData } from './i-mdc-datepicker-dialog-options';
import { MdcDatepickerDialogConfiguration } from './mdc-datepicker-dialog-configuration';
import addMonths from 'date-fns/addMonths';
import isSameDay from 'date-fns/isSameDay';

interface IDay {
  date?: Date | null;
  disabled: boolean;
}

interface IMonth {
  name: string;
  disabled: boolean;
}

@useView(PLATFORM.moduleName('./mdc-datepicker-dialog.html'))
export class MdcDatepickerDialog {
  constructor(private configuration: MdcDatepickerDialogConfiguration) { }

  dialog: MdcDialog;
  months: IMonth[];

  month: number;
  years: number[];
  year: number;
  weekDays: string[];
  date?: Date;
  originalData: Partial<IMdcDatepickerDialogData>;
  options: Partial<IMdcDatepickerDialogOptions>;
  days: IDay[];

  activate(data: Partial<IMdcDatepickerDialogData>) {
    this.originalData = data ?? {};
    this.options = { ...this.configuration.defaultOptions, ...data?.options };
    this.options.i18n = { ...this.configuration.defaultOptions.i18n, ...data?.options?.i18n };
    this.weekDays = Array.from({ length: 7 }, (_, i) => format(new Date(2020, 10, 16 + i - 1 + this.options.firstDay!), 'EEE', { locale: this.options?.i18n?.dateFnsLocale }));
    this.date = startOfDay(data.date ?? new Date());
    if (this.options.min && this.date < this.options.min) {
      this.date = this.options.min;
    }
    if (this.options.max && this.date > this.options.max) {
      this.date = this.options.max;
    }
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();
    this.buildDates();
  }

  buildDates() {
    const min = Math.max(this.options.min ? this.options.min.getFullYear() : this.options.yearRange!.min, this.options.yearRange!.min);
    const max = Math.min(this.options.max ? this.options.max.getFullYear() : this.options.yearRange!.max, this.options.yearRange!.max);
    this.years = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    this.months = Array.from({ length: 12 }, (_, i) => ({
      name: format(new Date(2020, i), 'LLLL', { locale: this.options?.i18n?.dateFnsLocale }),
      disabled: this.isMonthDisabled(this.year, i)
    }));
    const first = new Date(this.year, this.month);
    const offset = this.weekDays.indexOf(format(first, 'EEE', { locale: this.options?.i18n?.dateFnsLocale }));
    this.days = Array.from({ length: 42 }, (_, i) => {
      const date = addDays(first, i - offset);
      const sameMonth = isSameMonth(first, date);
      return {
        date: this.options.showAll || sameMonth ? date : null,
        disabled: this.isDayDisabled(date, sameMonth)
      };
    });
    const currentDate = this.days.find(x => x?.date && isSameDay(x?.date, this.date!));
    if (currentDate && !currentDate.disabled) {
      this.date = currentDate.date!;
    }
  }

  isDayDisabled(date: Date, sameMonth: boolean): boolean {
    return !sameMonth
      || this.options.min && this.options.min > date
      || this.options.max && this.options.max < date
      || this.options.disableFunction?.(date)
      || this.options.disableWeekends! && isWeekend(date);
  }

  isMonthDisabled(year: number, month: number) {
    return !!this.options.min && this.options.min > lastDayOfMonth(new Date(year, month))
      || !!this.options.max && this.options.max < new Date(year, month);
  }

  monthSelected(month: number) {
    this.month = month;
  }

  select(d: IDay) {
    if (d.disabled) {
      return;
    }
    this.date = d.date!;
  }

  ok() {
    this.originalData.date = this.date;
    this.dialog.close('ok');
  }

  @computedFrom('year', 'month')
  get canGoNext() {
    const nextMonth = addMonths(new Date(this.year, this.month), 1);
    return this.isMonthDisabled(nextMonth.getFullYear(), nextMonth.getMonth());
  }

  next() {
    const nextMonth = addMonths(new Date(this.year, this.month), 1);
    [this.year, this.month] = [nextMonth.getFullYear(), nextMonth.getMonth()];
  }

  @computedFrom('year', 'month')
  get canGoPrev() {
    const prevMonth = addMonths(new Date(this.year, this.month), -1);
    return this.isMonthDisabled(prevMonth.getFullYear(), prevMonth.getMonth());
  }

  prev() {
    const prevMonth = addMonths(new Date(this.year, this.month), -1);
    [this.year, this.month] = [prevMonth.getFullYear(), prevMonth.getMonth()];
  }
}
