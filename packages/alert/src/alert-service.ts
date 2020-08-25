import { Subject, merge, } from 'rxjs';
import { map, startWith, scan } from 'rxjs/operators';
import { AlertModal } from './alert-modal/alert-modal';
import { autoinject } from 'aurelia-framework';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { MdcDialogService } from '@aurelia-mdc-web/dialog';

@autoinject
export class AlertService {
  constructor(private dialogService: MdcDialogService, private appInsights: ApplicationInsights) { }

  increment$ = new Subject();
  decrement$ = new Subject();
  busy$ = merge(this.increment$.pipe(map(() => 1)), this.decrement$.pipe(map(() => -1)))
    .pipe(
      startWith(0),
      scan((acc, v) => acc + v > 0 ? acc += v : 0),
      map(v => v !== 0)
    );

  showProgress() {
    this.increment$.next();
  }

  hideProgress() {
    this.decrement$.next();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async usingProgress<T, E = never>(action: () => Promise<T>, catchHandler?: (e: any) => Promise<E> | E): Promise<T | E> {
    try {
      this.showProgress();
      return await action();
    } catch (e) {
      if (catchHandler) {
        return await catchHandler(e);
      } else {
        throw e;
      }
    } finally {
      this.hideProgress();
    }
  }

  private async showModal(message: string, icon: string, iconColour: string, okText: string, cancelText: string): Promise<string> {
    return this.dialogService.open({
      viewModel: AlertModal,
      model: { icon, iconColour, message, okText, cancelText }
    });
  }

  async alert(message: string, icon: string = 'info', iconColour: string = 'mdc-theme--primary'): Promise<boolean> {
    return await this.showModal(message, icon, iconColour, 'OK', undefined) === 'ok';
  }

  async confirm(message: string, icon: string = 'help', iconColour: string = 'mdc-theme--primary'): Promise<boolean> {
    return await this.showModal(message, icon, iconColour, 'YES', 'NO') === 'ok';
  }

  async error(message: string): Promise<boolean> {
    return this.alert(message, 'error', 'error');
  }

  async criticalError(message: string, error: unknown): Promise<boolean> {
    if (this.appInsights.config.instrumentationKey) {
      this.appInsights.trackException(error);
    }
    return this.alert(message, 'error', 'error');
  }
}
