import { AlertService } from '../alert-service';

export interface IWithAlertService {
  alertService: AlertService;
}

export function usingProgress(errorMessage?: string | ((e: unknown) => string), allowCancel: boolean = false, allowHtml: boolean = false) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function usingProgressDecorator<T>(_target: IWithAlertService, _propertyKey: string, descriptor: TypedPropertyDescriptor<(this: IWithAlertService, ...args: unknown[]) => Promise<T>>) {
    const originalMethod = descriptor.value;
    if (originalMethod !== undefined) {
      descriptor.value = async function withProgress(this: IWithAlertService, ...args) {
        if (!this.alertService) {
          throw new Error('Did you forget to inject AlertService?');
        }
        const abortController = new AbortController();
        document.addEventListener('global-progress:cancel', () => abortController.abort(), { once: true });
        return this.alertService.usingProgress(async () => {
          return originalMethod.apply(this, [...args, abortController.signal]) as Promise<T>;
        }, async e => {
          const message = errorMessage instanceof Function ? errorMessage(e) : errorMessage;
          if (e.nonCritical) {
            await this.alertService.error(message ?? e.message, allowHtml);
          } else {
            await this.alertService.criticalError(message ?? e.message, e, allowHtml);
          }
          throw e;
        }, allowCancel);
      };
    }
    return descriptor;
  };
}
