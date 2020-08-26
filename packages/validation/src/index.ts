/* eslint-disable no-template-curly-in-string */
import { addPasswordValidationRules } from './validation';

import { FrameworkConfiguration } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Logger } from 'aurelia-logging';
import { I18NResource } from './i-18n-resource';

export function configure(frameworkConfiguration: FrameworkConfiguration) {
  const i18n = frameworkConfiguration.container.get(I18N);
  // i18n might not be initialised yet
  if (i18n.i18nextDeferred) {
    i18n.i18nextDeferred.then(i18next => {
      const defaultResource: I18NResource = {
        requiredLength: '${$displayName} must have at least ${$config.length} characters',
        requireDigit: '${$displayName} must include digits',
        requireLowercase: '${$displayName} must include lowercase letters',
        requireUppercase: '${$displayName} must include uppercase letters',
        requireNonAlphanumeric: '${$displayName} must include special characters',
        requiredUniqueChars: '${$displayName} must have at least ${$config.length} unique characters',
        mustMatch: '${$displayName} must match the ${$config.otherPropertyName}'
      };
      i18next.addResourceBundle('en', 'aurelia-toolkit:validation', defaultResource, true, false);
      addPasswordValidationRules(i18n);
    });
  } else {
    const logger = frameworkConfiguration.container.get(Logger);
    logger.error('Did you forget to initialise I18N plugin?');
    throw Error();
  }
}
