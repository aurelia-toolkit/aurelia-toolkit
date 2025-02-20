import { Exception } from './exception';

export class ForbiddenException extends Exception {
  message: string = 'Forbidden';
}
