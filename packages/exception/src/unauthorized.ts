import { Exception } from './exception';

export class UnauthorizedException extends Exception {
  message: string = 'Unauthorized';
}
