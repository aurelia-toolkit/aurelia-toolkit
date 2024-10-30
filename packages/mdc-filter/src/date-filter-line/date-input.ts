import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';

export class DateInputValueConverter {
  toView(value: string | Date | undefined): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      value = new Date(Date.parse(value));
    }

    return format(value, 'yyyy-MM-dd');
  }

  fromView(value: string): Date | undefined {
    return (value !== undefined && value !== '') ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;
  }
}
