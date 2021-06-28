export class MdcFilterConfiguration {
  getOperatorLabel: (operator: unknown) => string = operator => `${operator}`;
  dateOperators: unknown[] = [];
  dateRangeOperators: unknown[] = [];
  lookupOperators: unknown[] = [];
  numberOperators: unknown[] = [];
  selectOperators: unknown[] = [];
  textOperators: unknown[] = [];
}
