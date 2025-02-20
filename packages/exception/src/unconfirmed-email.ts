import { Exception } from './exception';

export class UnconfirmedEmailException extends Exception {
  message: string = 'Unconfirmed email';
 }
