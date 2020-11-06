import { getLogger, Logger } from 'aurelia-logging';
import { autoinject } from 'aurelia-framework';
import jwtDecode from 'jwt-decode';
import { from, Observable, of, BehaviorSubject, timer, empty, fromEvent, Subject } from 'rxjs';
import { switchMap, map, take, debounce, filter, catchError } from 'rxjs/operators';
import fromUnixTime from 'date-fns/fromUnixTime';
import isAfter from 'date-fns/isAfter';
import subMilliseconds from 'date-fns/subMilliseconds';
import { HttpClient } from 'aurelia-fetch-client';
import { ILoginResponse } from './i-login-response';
import { IUsersClient } from './i-users-client';
import { ITokens } from './i-tokens';
import { IJwtToken } from './i-jwt-token';
import { DateService } from '@aurelia-toolkit/date';
import { AuthConfiguration } from './auth-configuration';

@autoinject
export class AuthService {
  constructor(private dateService: DateService, private usersClient: IUsersClient, private httpClient: HttpClient,
    private authConfiguration: AuthConfiguration) {
    this.logger = getLogger('AuthService');
  }

  logger: Logger;

  logins$ = new BehaviorSubject<Observable<ILoginResponse | undefined>>(of(undefined));
  tokens$: Observable<ITokens | undefined> = this.logins$.pipe(
    switchMap(x => x.pipe(catchError(() => of(undefined)))),
    map(x => {
      if (!x) {
        return undefined;
      }
      const decodedToken = jwtDecode(x.token) as IJwtToken;
      return { token: x.token, refreshToken: x.refreshToken, decodedToken, expiryDate: fromUnixTime(decodedToken.exp) };
    }));
  tokensForRefresh$ = new BehaviorSubject<ITokens | undefined>(undefined);
  isAuthenticated$ = this.tokens$.pipe(map(x => !!x));
  expired$ = new Subject();

  storageKey = this.authConfiguration.storageKey ?? `${location.origin}${location.origin.endsWith('/') ? '' : '/'}_tokenResponse_v1`;

  async login(request: unknown) {
    const p = this.usersClient.login(request);
    this.logins$.next(from(p));
    await p;
  }

  logout() {
    this.logins$.next(of(undefined));
  }

  async init(): Promise<void> {
    this.httpClient.configure(config => {
      config.withInterceptor({
        request: async request => this.appendAuthHeaders(request),
        response: r => this.useNewToken(r)
      });
    });

    const tokenResponseString = localStorage.getItem(this.storageKey);
    this.logger.debug('stored token', tokenResponseString);
    if (tokenResponseString) {
      const loginResponse = JSON.parse(tokenResponseString) as ILoginResponse;
      this.logins$.next(of(loginResponse));
      if (loginResponse.refreshToken) {
        await this.refreshToken(loginResponse.refreshToken);
      }
    } else {
      this.logins$.next(of(undefined));
    }
    // wait till refresh token arrives
    await this.getTokens();

    // token saver
    this.logins$.pipe(switchMap(x => x.pipe(catchError(() => of(undefined)))))
      .subscribe(x => {
        if (x) {
          localStorage.setItem(this.storageKey, JSON.stringify(x));
        } else {
          localStorage.removeItem(this.storageKey);
        }
      });

    // expiry checker
    this.tokens$.pipe(
      debounce(x => {
        const expiryDate = x?.expiryDate;
        return expiryDate && isAfter(expiryDate, this.dateService.now())
          ? timer(this.dateService.serverToLocal(expiryDate))
          : empty();
      }),
      filter(x => !!x)
    ).subscribe(() => {
      this.logins$.next(of(undefined));
      this.expired$.next();
    });

    // token refresher
    this.tokens$.pipe(
      // delay refresh until a token is expired discarding a previous value
      debounce(x => {
        const expiryDate = x?.expiryDate;
        return expiryDate && isAfter(expiryDate, this.dateService.now())
          ? timer(subMilliseconds(this.dateService.serverToLocal(expiryDate), this.authConfiguration.tokenRefreshThreshold))
          : empty();
      }),
      // no need to refresh an empty token. Has to come after debounce so that a previous refresh is still cancelled
      filter(x => !!x?.refreshToken),
    ).subscribe(x => { this.refreshToken(x!.refreshToken!); });

    // subscribe to storage change events and update
    fromEvent<StorageEvent>(window, 'storage').pipe(
      filter(x => x.key === this.storageKey && x.newValue !== x.oldValue)
    ).subscribe(x => {
      this.logger.debug('storage modified', x.newValue);
      const loginResponse = x.newValue ? JSON.parse(x.newValue) as ILoginResponse : undefined;
      this.logins$.next(of(loginResponse));
    });
  }

  async refreshToken(refreshToken: string): Promise<void> {
    this.tokensForRefresh$.next(await this.getTokens());
    const p = this.usersClient.refreshToken({ refreshToken });
    this.logins$.next(from(p));
  }

  async isAuthenticated(): Promise<boolean> {
    return this.isAuthenticated$.pipe(take(1)).toPromise();
  }

  async getTokens(): Promise<ITokens | undefined> {
    return this.tokens$.pipe(take(1)).toPromise();
  }

  async appendAuthHeaders(request: Request): Promise<Request> {
    if (request.url.includes('Login')) {
      return request;
    }
    // RefreshToken request can lock itself because it is added to the tokens$ stream
    // to avoid locking previous auth token is saved to a separate stream prior to the call
    const tokens = request.url.includes('RefreshToken') ? await this.tokensForRefresh$.pipe(take(1)).toPromise() : await this.getTokens();
    if (tokens) {
      request.headers.set('Authorization', `Bearer ${tokens.token}`);
      if (tokens.refreshToken) {
        request.headers.set('remember-me', 'true');
      }
    }
    return request;
  }

  useNewToken(r: Response): Response {
    const newToken = r.headers.get('new_token');
    const refreshToken = r.headers.get('refresh_token');
    if (newToken) {
      this.logins$.next(of({ token: newToken, refreshToken: refreshToken }));
    }
    return r;
  }

}
