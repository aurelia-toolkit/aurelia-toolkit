import { AuthConfiguration } from './auth-configuration';
import { FrameworkConfiguration } from 'aurelia-framework';

export { AuthService } from './auth-service';
export { AuthConfiguration } from './auth-configuration';
export { IJwtToken } from './i-jwt-token';
export { ITokens } from './i-tokens';
export { IUsersClient } from './i-users-client';
export { AuthStatus } from './router-config';
export { RoleCheckStep, isRouteAllowed } from './role-check-step';

export function configure(frameworkConfig: FrameworkConfiguration, callback?: (config: AuthConfiguration) => void) {
  if (typeof callback === 'function') {
    const config = frameworkConfig.container.get(AuthConfiguration);
    callback(config);
  }
}
