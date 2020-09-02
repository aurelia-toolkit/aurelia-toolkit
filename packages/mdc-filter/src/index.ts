import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Logger } from 'aurelia-logging';
import { I18NResource } from './i-18n-resource';

export { Filter } from './filter';
export { IFilterLine } from './i-filter-line';
export { I18NResource } from './i-18n-resource';

export function configure(frameworkConfiguration: FrameworkConfiguration) {
  frameworkConfiguration.globalResources([
    PLATFORM.moduleName('./filter'),
    PLATFORM.moduleName('./filter-line-container/filter-line-container'),
    PLATFORM.moduleName('./filter-operator-converter'),
    PLATFORM.moduleName('./date-filter-line/date-filter-line'),
    PLATFORM.moduleName('./bool-filter-line/bool-filter-line'),
    PLATFORM.moduleName('./lookup-filter-line/lookup-filter-line'),
    PLATFORM.moduleName('./number-filter-line/number-filter-line'),
    PLATFORM.moduleName('./select-filter-line/select-filter-line'),
    PLATFORM.moduleName('./text-filter-line/text-filter-line'),
    PLATFORM.moduleName('./filter-actions/filter-actions')
  ]);

  const i18n = frameworkConfiguration.container.get(I18N);
  // i18n might not be initialised yet
  if (i18n.i18nextDeferred) {
    i18n.i18nextDeferred.then(i18next => {
      const filter: I18NResource = {
        is: 'is',
        isAfter: 'is after',
        isBefore: 'is before',
        isNot: 'is not',
        like: 'like',
        notLike: 'not like',
        addFilter: 'Add filter',
        search: 'Search'
      };
      i18next.addResourceBundle('en', 'aurelia-toolkit', { filter }, true, false);
    });
  } else {
    const logger = frameworkConfiguration.container.get(Logger);
    logger.error('Did you forget to initialise I18N plugin?');
    throw Error();
  }
}
