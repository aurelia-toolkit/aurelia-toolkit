export interface IApiException {
  type: string;
  title: string;
  status: number;
  instance: string;
  traceId: string;
  requestId: string;
  stack?: string;
}
