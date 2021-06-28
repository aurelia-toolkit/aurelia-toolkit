export interface IFilterLine {
	name: string;
	label: string;
	operators: unknown[];
	operator?: unknown;
	value?: unknown;
	maxWidth: number;
	element: Element;
	hydrate(fl: IFilterLine): void;
  toJson(): Partial<IFilterLine>;
  assignValue(fl: IFilterLine): void;
}
