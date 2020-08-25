import { FilterOperator } from './filter-operator';
import { autoinject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { I18NResource } from './i-18n-resource';

@autoinject
export class FilterOperatorValueConverter {
  constructor(private i18n: I18N) {
    this.i18nResource = this.i18n.tr('aurelia-toolkit:filter', { returnObjects: true }) as unknown as I18NResource;
  }

  i18nResource: I18NResource;

  toView(value: FilterOperator): string {
    switch (value) {
      case FilterOperator.Like: return this.i18nResource.like;
      case FilterOperator.NotLike: return this.i18nResource.notLike;
      case FilterOperator.Is: return this.i18nResource.is;
      case FilterOperator.IsNot: return this.i18nResource.isNot;
      case FilterOperator.LessThan: return '≤';
      case FilterOperator.GreaterThan: return '≥';
      case FilterOperator.IsBefore: return this.i18nResource.isBefore;
      case FilterOperator.IsAfter: return this.i18nResource.isAfter;
    }
  }

  fromView(): number {
    throw new Error('Not implemented');
  }
}
