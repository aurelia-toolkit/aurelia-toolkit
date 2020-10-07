/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-namespace */
import {
  PropertyAccessor, ValidationRules, FluentRules, ValidationMessageProvider, validationMessages,
  FluentRuleCustomizer
} from 'aurelia-validation';
import { I18N } from 'aurelia-i18n';
import { I18NResource } from './i-18n-resource';
import { IPasswordRequirements } from './i-password-requirements';
import { rules } from './constants';

declare module 'aurelia-validation' {
  namespace ValidationRules {
    function ensureEx<TObject, TValue>(property: PropertyAccessor<TObject, TValue>): FluentRules<TObject, TValue>;
  }

  interface FluentRuleCustomizer<TObject, TValue> {
    ensure<TValue>(subject: string | ((model: TObject) => TValue)): FluentRules<TObject, TValue>;
  }
}

ValidationRules.ensureEx = function <TObject, TValue>(property: PropertyAccessor<TObject, TValue>): FluentRules<TObject, TValue> {
  return ValidationRules.ensure(property);
};

export { ValidationRules };

ValidationMessageProvider.prototype.getDisplayName = function () { return ''; };
for (const key in validationMessages) {
  const message = validationMessages[key];
  if (message.endsWith('.')) {
    // eslint-disable-next-line no-template-curly-in-string
    validationMessages[key] = message.substring(0, message.length - 1).replace('${$displayName}','').trim();
  }
}

export function addPasswordValidationRules(i18n: I18N) {
  const i18nResource = i18n.tr('aurelia-toolkit:validation', { returnObjects: true }) as unknown as I18NResource;

  ValidationRules.customRule(rules.REQUIRED_LENGTH, (v: string, _: unknown, length: number) => {
    return !!v && v.length >= length;
  }, i18nResource.requiredLength, (length: number) => ({ length }));

  ValidationRules.customRule(rules.REQUIRE_DIGIT, (v: string) => {
    return /[0-9]+/.test(v);
  }, i18nResource.requireDigit);

  ValidationRules.customRule(rules.REQUIRE_LOWERCASE, (v: string) => {
    return /[a-z]+/.test(v);
  }, i18nResource.requireLowercase);

  ValidationRules.customRule(rules.REQUIRE_UPPERCASE, (v: string) => {
    return /[A-Z]+/.test(v);
  }, i18nResource.requireUppercase);

  ValidationRules.customRule(rules.REQUIRE_NON_ALPHANUMERIC, (v: string) => {
    return /[\W]+/.test(v);
  }, i18nResource.requireNonAlphanumeric);

  ValidationRules.customRule(rules.REQUIRE_UNIQUE_CHARS, (v: string, _, length: number) => {
    if (!v) {
      return false;
    }
    let onlyUnique = '';
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < v.length; ++i) {
      const char = v[i];
      if (!onlyUnique.includes(char)) {
        onlyUnique += char;
      }
    }
    return onlyUnique.length >= length;
  }, i18nResource.requiredUniqueChars, (length: number) => ({ length }));

  ValidationRules.customRule(rules.MUST_MATCH,
    (value, obj, otherPropertyName) =>
      value === null
      || value === undefined
      || value === ''
      || obj[otherPropertyName] === null
      || obj[otherPropertyName] === undefined
      || obj[otherPropertyName] === ''
      || value === obj[otherPropertyName],
    i18nResource.mustMatch,
    otherPropertyName => ({ otherPropertyName })
  );
}

declare module 'aurelia-validation' {
  // tslint:disable-next-line:interface-name
  interface FluentRules<TObject, TValue> {
    password(requirements: IPasswordRequirements): FluentRuleCustomizer<TObject, TValue>;
    mustMatch(otherPropertyName: string): FluentRuleCustomizer<TObject, TValue>;
  }

  // tslint:disable-next-line:interface-name
  interface FluentRuleCustomizer<TObject, TValue> {
    password(requirements: IPasswordRequirements): FluentRuleCustomizer<TObject, TValue>;
    mustMatch(otherPropertyName: string): FluentRuleCustomizer<TObject, TValue>;
  }
}

function applyPasswordRules(customizer: FluentRuleCustomizer<unknown, unknown> | FluentRules<unknown, unknown>, r: IPasswordRequirements) {
  if (r.requiredLength) {
    customizer = customizer.satisfiesRule(rules.REQUIRED_LENGTH, r.requiredLength);
  }
  if (r.requireLowercase) {
    customizer = customizer.satisfiesRule(rules.REQUIRE_LOWERCASE);
  }
  if (r.requireUppercase) {
    customizer = customizer.satisfiesRule(rules.REQUIRE_UPPERCASE);
  }
  if (r.requireDigit) {
    customizer = customizer.satisfiesRule(rules.REQUIRE_DIGIT);
  }
  if (r.requireNonAlphanumeric) {
    customizer = customizer.satisfiesRule(rules.REQUIRE_NON_ALPHANUMERIC);
  }
  if (r.requiredUniqueChars) {
    customizer = customizer.satisfiesRule(rules.REQUIRE_UNIQUE_CHARS, r.requiredUniqueChars);
  }
  if (!customizer) {
    throw new Error('Password requirements are not set');
  }
  return customizer as FluentRuleCustomizer<unknown, unknown>;
}

FluentRules.prototype.password = function (this: FluentRules<unknown, unknown>, requirements: IPasswordRequirements) {
  return applyPasswordRules(this, requirements);
};

FluentRuleCustomizer.prototype.password = function (this: FluentRuleCustomizer<unknown, unknown>, requirements: IPasswordRequirements) {
  return applyPasswordRules(this, requirements);
};

FluentRules.prototype.mustMatch = function (this: FluentRules<unknown, unknown>, otherPropertyName: string) {
  return this.satisfiesRule('mustMatch', otherPropertyName);
};

FluentRuleCustomizer.prototype.mustMatch = function (this: FluentRuleCustomizer<unknown, unknown>, otherPropertyName: string) {
  return this.satisfiesRule('mustMatch', otherPropertyName);
};
