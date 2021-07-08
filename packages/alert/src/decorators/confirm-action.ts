import { IWithAlertService } from './using-progress';

export function confirmAction(message: string) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function <T>(_target: Object, _propertyKey: string, descriptor: TypedPropertyDescriptor<(this: IWithAlertService, ...args: unknown[]) => Promise<T | undefined>>) {
    const originalMethod = descriptor.value;
    if (originalMethod !== undefined) {
      descriptor.value = async function confirm(this: IWithAlertService, ...args) {
        if (!this.alertService) {
          throw new Error('Did you forget to inject AlertService?');
        }

        if (!await this.alertService.confirm(message)) {
          return;
        }
        return originalMethod.apply(this, args) as Promise<T>;
      };
    }
    return descriptor;
  };
}
