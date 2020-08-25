import { IJwtToken } from './i-jwt-token';

export interface ITokens {
  token: string;
  decodedToken: IJwtToken;
  refreshToken?: string | null;
}
