import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { merge } from 'rxjs/internal/observable/merge';
import { map } from 'rxjs/internal/operators/map';
import { scan } from 'rxjs/internal/operators/scan';
import { autoinject } from 'aurelia-framework';
import { MdcDialogService } from '@aurelia-mdc-web/dialog';
import { I18N } from 'aurelia-i18n';
import { IPromptDialogData } from './prompt-dialog/prompt-dialog';
import { ExceptionsTracker } from './exceptions-tracker';
import { IAlertModalPayload } from './alert-modal/i-alert-modal-payload';
import { AlertConfiguration } from './alert-configuration';

@autoinject
export class AlertService {
  constructor(private dialogService: MdcDialogService, private exceptionsTracker: ExceptionsTracker, private i18n: I18N, private alertConfiguration: AlertConfiguration) { }

  increment$ = new Subject<void>();
  decrement$ = new Subject<void>();
  busy$ = new BehaviorSubject<boolean>(false);
  busyAccumulator$ = merge(this.increment$.pipe(map(() => 1)), this.decrement$.pipe(map(() => -1)))
    .pipe(
      scan((acc, v) => acc += v, 0),
      map(v => v > 0)
    ).subscribe(this.busy$);
  allowCancel$ = new Subject<boolean>();

  showProgress() {
    this.increment$.next();
  }

  hideProgress() {
    this.decrement$.next();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async usingProgress<T, E = never>(action: () => Promise<T>, catchHandler?: (e: any) => Promise<E> | E, allowCancel?: boolean): Promise<T | E> {
    try {
      this.allowCancel$.next(allowCancel ?? false);
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

  async open<TModel>(options: { viewModel: unknown; model: TModel }): Promise<string> {
    try {
      this.hideProgress();
      return await this.dialogService.open(options);
    } finally {
      this.showProgress();
    }
  }

  async showModal(model: Partial<IAlertModalPayload>): Promise<string> {
    return await this.open({ viewModel: this.alertConfiguration.defaultAlertModal, model });
  }

  async alert(message: string | Partial<IAlertModalPayload>): Promise<boolean> {
    if (typeof message === 'string') {
      message = { message };
    }
    const model: Partial<IAlertModalPayload> = {
      icon: 'info',
      iconColour: 'mdc-theme--primary',
      button2Text: this.i18n.tr('aurelia-toolkit:alert.ok'),
      button2Action: 'ok',
      defaultAction: 'ok',
      successAction: 'ok',
      ...message
    };
    return await this.showModal(model) === model.successAction;
  }

  async confirm(message: string | Partial<IAlertModalPayload>): Promise<boolean> {
    if (typeof message === 'string') {
      message = { message };
    }
    const model: IAlertModalPayload = message.defensive
      ? {
        icon: 'help',
        iconColour: 'mdc-theme--primary',
        button1Text: this.i18n.tr('aurelia-toolkit:alert.yes'),
        button1Action: 'yes',
        button2Text: this.i18n.tr('aurelia-toolkit:alert.no'),
        button2Action: 'no',
        defaultAction: 'no',
        successAction: 'yes',
        ...message
      }
      : {
        icon: 'help',
        iconColour: 'mdc-theme--primary',
        button1Text: this.i18n.tr('aurelia-toolkit:alert.no'),
        button1Action: 'no',
        button2Text: this.i18n.tr('aurelia-toolkit:alert.yes'),
        button2Action: 'yes',
        defaultAction: 'yes',
        successAction: 'yes',
        ...message
      };
    return await this.showModal(model) === model.successAction;
  }

  async prompt(data: Partial<IPromptDialogData>): Promise<boolean> {
    return await this.open({ viewModel: this.alertConfiguration.defaultPromptDialog, model: data }) === 'ok';
  }

  async error(message: string | Partial<IAlertModalPayload>): Promise<boolean> {
    message ??= 'Error';
    if (typeof message === 'string') {
      message = { message };
    }
    message.icon = 'error';
    message.iconColour = 'mdc-theme--error';
    return this.alert(message);
  }

  async criticalError(message: string | Partial<IAlertModalPayload>, error: Error): Promise<boolean> {
    this.exceptionsTracker.track(error);
    return this.error(message);
  }
}
