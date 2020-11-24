import format from 'date-fns/format';

export class DateValueConverter {
  // eslint-disable-next-line no-undef
  toView(value: string | Date, formatStr?: string, locale?: Locale): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      value = new Date(Date.parse(value));
    }

    if (formatStr) {
      return format(value, formatStr, { locale });
    } else {
      return value.toLocaleDateString();
    }
  }
}
