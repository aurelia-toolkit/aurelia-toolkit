import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { Exception } from './exception';
import { IApiException } from './i-api-exception';
import { UnauthorizedException } from './unauthorized';
import { ForbiddenException } from './forbidden';

@inject(HttpClient)
export class ExceptionService {
  constructor(private http: HttpClient) { }

  registry = new Map<string, typeof Exception>();

  register(className: string, exceptionType: typeof Exception) {
    this.registry.set(className, exceptionType);
  }

  throw(apiException: IApiException): never {
    let exceptionType = this.registry.get(apiException.ClassName);
    if (!exceptionType) {
      exceptionType = Exception;
    }
    throw new exceptionType(apiException);
  }

  async assertResponse(r: Response): Promise<Response> {
    if (r.ok) {
      return r;
    } else if (r.status === 401) {
      throw new UnauthorizedException();
    } else if (r.status === 403) {
      throw new ForbiddenException();
    } else {
      const e = await r.json().then<IApiException>();
      this.throw(e);
    }
  }

  public addHttpInterceptor(): void {
    this.http.configure(c => {
      c.withInterceptor({ response: async r => this.assertResponse(r) });
    });
  }
}
