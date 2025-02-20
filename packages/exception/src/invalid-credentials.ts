import { Exception } from './exception';

export class InvalidCredentialsException extends Exception {
  message: string = 'Invalid credentials';

 }
