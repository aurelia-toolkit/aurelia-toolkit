import { IJwtToken } from './i-jwt-token';

export interface ITokens {
  token: string;
  decodedToken: IJwtToken;
  expiryDate: Date;
  refreshToken?: string | null;
}
