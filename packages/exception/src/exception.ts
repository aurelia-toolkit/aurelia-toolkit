import { IApiException } from './i-api-exception';

export class Exception implements Error {
  name = 'Exception';
  message: string;
  stack?: string;
  type: string;

  constructor(apiException?: IApiException) {
    if (apiException) {
      this.message = apiException.title;
      this.type = apiException.type;
      this.stack = apiException.stack;
    }
  }
}
