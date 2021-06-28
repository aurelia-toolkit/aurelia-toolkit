import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';
import { MdcFilterConfiguration } from './mdc-filter-configuration';

export { Filter } from './filter';
export { IFilterLine } from './i-filter-line';
export { FilterLineBase } from './filter-line-base';
export { MdcFilterConfiguration };

export function configure(frameworkConfiguration: FrameworkConfiguration, callback?: (config: MdcFilterConfiguration) => void) {
  frameworkConfiguration.globalResources([
    PLATFORM.moduleName('./filter'),
    PLATFORM.moduleName('./filter-operator-converter'),
    PLATFORM.moduleName('./date-filter-line/date-filter-line'),
    PLATFORM.moduleName('./date-range-filter-line/date-range-filter-line'),
    PLATFORM.moduleName('./bool-filter-line/bool-filter-line'),
    PLATFORM.moduleName('./lookup-filter-line/lookup-filter-line'),
    PLATFORM.moduleName('./number-filter-line/number-filter-line'),
    PLATFORM.moduleName('./select-filter-line/select-filter-line'),
    PLATFORM.moduleName('./text-filter-line/text-filter-line'),
    PLATFORM.moduleName('./filter-actions/filter-actions')
  ]);

  const config = frameworkConfiguration.container.get(MdcFilterConfiguration);
  if (typeof callback === 'function') {
    callback(config);
  }
  if (!config.getOperatorLabel) {
    config.getOperatorLabel = operator => `${operator}`;
  }
}
