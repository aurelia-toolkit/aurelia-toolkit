// eslint-disable-next-line import/no-unassigned-import
import 'aurelia-router';

export enum AuthStatus {
  All = 0,
  Authenticated = 1,
  NonAuthenticated = 2
}

declare module 'aurelia-router' {
  interface RouteConfig {
    auth?: AuthStatus;
    permission?: string;
    role?: string;
  }
}
