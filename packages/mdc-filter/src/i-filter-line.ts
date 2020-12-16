import { FilterOperator } from './filter-operator';

export interface IFilterLine {
	name: string;
	label: string;
	operators: FilterOperator[];
	operator?: FilterOperator;
	value?: unknown;
	maxWidth: number;
	element: Element;
	hydrate(fl: IFilterLine): void;
  toJson(): Partial<IFilterLine>;
  assignValue(fl: IFilterLine): void;
}
