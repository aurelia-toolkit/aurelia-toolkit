export interface IMdcDatepickerDialogOptions extends Record<string, unknown> {
  label: string;
  yearRange: {
    min: number;
    max: number;
  } | number;
  format: string;
  min: Date;
  max: Date;
  disableFunction: (d: Date) => boolean;
  disableWeekends: boolean;
  firstDay: number;
  i18n: Partial<{
    cancel: string;
    ok: string;
    // eslint-disable-next-line no-undef
    dateFnsLocale: Locale;
  }> & Record<string, unknown>;
  showAll: boolean;
}

export interface IMdcDatepickerDialogData {
  date: Date | null;
  options: Partial<IMdcDatepickerDialogOptions>;
}
