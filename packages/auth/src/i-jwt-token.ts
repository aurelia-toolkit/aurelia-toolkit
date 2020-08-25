export interface IJwtToken {
  exp: number;
  permission: string | string[];
  role: string | string[];
}
