import { autoinject } from 'aurelia-framework';
import { PipelineStep, NavigationInstruction, Next, RedirectToRoute, RouteConfig } from 'aurelia-router';
import { AuthService, IJwtToken } from '.';
import { AuthStatus } from './router-config';

@autoinject
export class RoleCheckStep implements PipelineStep {
  constructor(private authService: AuthService) { }

  async run(navigationInstruction: NavigationInstruction, next: Next): Promise<unknown> {
    const tokens = await this.authService.getTokens();
    if (navigationInstruction.getAllInstructions().some(i => !isRouteAllowed(i.config, tokens?.decodedToken))) {
      return next.cancel(new RedirectToRoute(tokens?.decodedToken ? 'forbidden' : 'expired'));
    }
    return next() as Promise<unknown>;
  }
}

export function isRouteAllowed(config: RouteConfig, token?: IJwtToken): boolean {
  if (token) {
    switch (config.auth) {
      case undefined:
      case AuthStatus.All:
        return true;
      case AuthStatus.Authenticated: {
        if (config.permission !== undefined) {
          return token.permission !== undefined
            && (token.permission instanceof String ? token.permission === config.permission : token.permission.includes(config.permission));
        } else if (config.role !== undefined) {
          return token.role instanceof String ? token.role === config.role : token.role?.includes(config.role);
        } else {
          return true;
        }
      }
      default: return false;
    }
  } else {
    return config.auth === undefined || config.auth === AuthStatus.All || config.auth === AuthStatus.NonAuthenticated;
  }
}
