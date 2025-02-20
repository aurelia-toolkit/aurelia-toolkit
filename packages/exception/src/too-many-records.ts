import { Exception } from './exception';

export class TooManyRecordsException extends Exception {
  message: string = 'Too many records';
}
