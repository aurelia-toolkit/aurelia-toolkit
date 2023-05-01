import { Subject } from 'rxjs/internal/Subject';
import { merge } from 'rxjs/internal/observable/merge';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { scan } from 'rxjs/internal/operators/scan';
import { AlertModal } from './alert-modal/alert-modal';
import { autoinject } from 'aurelia-framework';
import { MdcDialogService } from '@aurelia-mdc-web/dialog';
import { I18N } from 'aurelia-i18n';
import { IPromptDialogData, PromptDialog } from './prompt-dialog/prompt-dialog';
import { ExceptionsTracker } from './exceptions-tracker';

@autoinject
export class AlertService {
  constructor(private dialogService: MdcDialogService, private exceptionsTracker: ExceptionsTracker, private i18n: I18N) { }

  increment$ = new Subject<void>();
  decrement$ = new Subject<void>();
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

  async open<TModel>(options: { viewModel: unknown; model: TModel }): Promise<string> {
    try {
      this.hideProgress();
      return await this.dialogService.open(options);
    } finally {
      this.showProgress();
    }
  }

  async showModal(message: string | undefined, allowHtml: boolean, icon: string, iconColour: string, okText: string, cancelText?: string): Promise<string> {
    return await this.open({
      viewModel: AlertModal,
      model: { icon, iconColour, message: allowHtml ? undefined : message, html: allowHtml ? message : undefined, okText, cancelText }
    });
  }

  async alert(message: string, icon: string = 'info', iconColour: string = 'mdc-theme--primary', allowHtml: boolean = false): Promise<boolean> {
    return await this.showModal(message, allowHtml, icon, iconColour, this.i18n.tr('aurelia-toolkit:alert.ok'), undefined) === 'ok';
  }

  async confirm(message: string, icon: string = 'help', iconColour: string = 'mdc-theme--primary', allowHtml: boolean = false): Promise<boolean> {
    return await this.showModal(message, allowHtml, icon, iconColour, this.i18n.tr('aurelia-toolkit:alert.yes'), this.i18n.tr('aurelia-toolkit:alert.no')) === 'ok';
  }

  async prompt(data: Partial<IPromptDialogData>): Promise<boolean> {
    return await this.open({ viewModel: PromptDialog, model: data }) === 'ok';
  }

  async error(message: string, allowHtml: boolean = false): Promise<boolean> {
    return this.alert(message, 'error', 'mdc-theme--error', allowHtml);
  }

  async criticalError(message: string, error: Error, allowHtml: boolean = false): Promise<boolean> {
    this.exceptionsTracker.track(error);
    return this.alert(message, 'error', 'mdc-theme--error', allowHtml);
  }
}
