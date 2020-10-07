import { ILoginResponse } from './i-login-response';
import { IRefreshTokenRequest } from './i-refresh-token-request';

export abstract class IUsersClient {
  abstract login(request: unknown): Promise<ILoginResponse>;
  abstract refreshToken(request: IRefreshTokenRequest): Promise<ILoginResponse>;
}
