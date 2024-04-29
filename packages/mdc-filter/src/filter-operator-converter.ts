import { inject } from 'aurelia';
import { MdcFilterConfiguration } from './mdc-filter-configuration';

@inject(MdcFilterConfiguration)
export class FilterOperatorValueConverter {
  constructor(private config: MdcFilterConfiguration) { }

  toView(value: unknown): string {
    return this.config.getOperatorLabel(value);
  }
}
