import { AlertService } from '../alert-service';

export interface IWithAlertService {
  alertService: AlertService;
}

export function usingProgress(errorMessage?: string) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function usingProgressDecorator<T>(_target: Object, _propertyKey: string, descriptor: TypedPropertyDescriptor<(this: IWithAlertService, ...args: unknown[]) => Promise<T>>) {
    const originalMethod = descriptor.value;
    if (originalMethod !== undefined) {
      descriptor.value = async function withProgress(this: IWithAlertService, ...args) {
        if (!this.alertService) {
          throw new Error('Did you forget to inject AlertService?');
        }
        return this.alertService.usingProgress(async () => {
          return originalMethod.apply(this, args) as Promise<T>;
        }, async e => {
          if (e.nonCritical) {
            await this.alertService.error(errorMessage ?? e.message);
          } else {
            await this.alertService.criticalError(errorMessage ?? e.message, e);
          }
          throw e;
        });
      };
    }
    return descriptor;
  };
}
