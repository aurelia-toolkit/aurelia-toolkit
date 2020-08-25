import { IApiException } from './i-api-exception';

export class Exception implements Error {
  name = 'Exception';
  message: string;
  stack?: string;
  class: string;
  data: unknown;

  constructor(apiException?: IApiException) {
    if (apiException) {
      this.message = apiException.Message;
      this.class = apiException.ClassName;
      this.data = apiException.Data;
      this.stack = apiException.StackTraceString;
    }
  }
}
