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
      const validation: I18NResource = {
        requiredLength: 'must have at least ${$config.length} characters',
        requireDigit: 'must include digits',
        requireLowercase: 'must include lowercase letters',
        requireUppercase: 'must include uppercase letters',
        requireNonAlphanumeric: 'must include special characters',
        requiredUniqueChars: 'must have at least ${$config.length} unique characters',
        mustMatch: 'must match the ${$config.otherPropertyName}'
      };
      i18next.addResourceBundle('en', 'aurelia-toolkit', { validation }, true, false);
      addPasswordValidationRules(i18n);
    });
  } else {
    const logger = frameworkConfiguration.container.get(Logger);
    logger.error('Did you forget to initialise I18N plugin?');
    throw Error();
  }
}
