import { autoinject } from 'aurelia-framework';
import { MdcFilterConfiguration } from './mdc-filter-configuration';

@autoinject
export class FilterOperatorValueConverter {
  constructor(private config: MdcFilterConfiguration) { }

  toView(value: unknown): string {
    return this.config.getOperatorLabel(value);
  }
}
