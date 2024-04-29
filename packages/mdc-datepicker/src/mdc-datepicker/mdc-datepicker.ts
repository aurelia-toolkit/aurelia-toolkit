import { IMdcTextFieldElement } from '@aurelia-mdc-web/text-field';
import { IValidatedElement, IError, booleanAttr, date, number } from '@aurelia-mdc-web/base';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { MdcDialogService } from '@aurelia-mdc-web/dialog';
import { MdcDatepickerDialog } from '../mdc-datepicker-dialog/mdc-datepicker-dialog';
import { IMdcDatepickerDialogData, IMdcDatepickerDialogOptions } from '../mdc-datepicker-dialog/i-mdc-datepicker-dialog-options';
import { MdcDefaultTextFieldConfiguration } from '@aurelia-mdc-web/text-field';
import { TaskQueue, bindable, customElement, inject } from 'aurelia';
import template from './mdc-datepicker.html';

const DATE_ISO_FORMAT = 'yyyy-MM-dd';
const DATETIME_ISO_FORMAT = 'yyyy-MM-dd\'T\'HH:mm:ss';

@inject(Element, TaskQueue, MdcDialogService, MdcDefaultTextFieldConfiguration)
@customElement({ name: 'mdc-datepicker', template })
export class MdcDatepicker {
  constructor(private element: HTMLElement, private taskQueue: TaskQueue, private dialogService: MdcDialogService, private defaultTextFieldConfiguration: MdcDefaultTextFieldConfiguration) {
    defineMdcDatepickerElementApis(this.element);
  }

  input: IMdcTextFieldElement;
  inputmaskValue: string;
  private _value: string;

  @bindable({ set: booleanAttr })
  outlined?: boolean = this.defaultTextFieldConfiguration.outlined;

  @bindable
  label: string;

  @bindable
  format: string = 'dd/MM/yyyy';

  @bindable
  inputmaskFormat: string = 'dd/mm/yyyy';

  @bindable
  dialogFormat: string = 'E, MMM d';

  @bindable({ set: date })
  min: Date;

  @bindable({ set: date })
  max: Date;

  @bindable
  disableFunction: (d: Date) => boolean;

  @bindable({ set: booleanAttr })
  disableWeekends: boolean;

  @bindable({ set: booleanAttr })
  showAll: boolean;

  @bindable({ set: number })
  firstDay: number;

  @bindable
  mdcI18n: IMdcDatepickerDialogOptions['i18n'];

  @bindable({ set: booleanAttr })
  readonly: boolean;

  @bindable({ set: booleanAttr })
  time: boolean;

  get value(): string {
    if (this.input) {
      return this.inputmaskValue !== '' && this.inputmaskValue !== undefined
        ? format(parse(this.inputmaskValue, this.format, new Date()), this.getIsoFormat())
        : '';
    } else {
      return this._value;
    }
  }

  set value(value: string) {
    this._value = value;
    if (this.input) {
      this.inputmaskValue = value !== '' ? format(parse(value, this.getIsoFormat(), new Date()), this.format) : '';
    }
  }

  attached() {
    if (this.input !== undefined) {
      this.value = this._value;
    }
  }

  handleBlur(e: Event) {
    e.cancelBubble = true;
    this.element.dispatchEvent(new CustomEvent('blur', { bubbles: true }));
  }

  handleChange(e: Event) {
    e.cancelBubble = true;
    this.taskQueue.queueTask(() => this.element.dispatchEvent(new CustomEvent('change', { bubbles: true })));
  }

  handleInput(e: Event) {
    e.cancelBubble = true;
    this.taskQueue.queueTask(() => this.element.dispatchEvent(new CustomEvent('input', { bubbles: true })));
  }

  getIsoFormat() {
    return this.time ? DATETIME_ISO_FORMAT : DATE_ISO_FORMAT;
  }

  getDateValue(): Date | undefined {
    const value = this.value;
    return value !== '' ? parse(value, this.getIsoFormat(), new Date()) : undefined;
  }

  async open() {
    const data: Partial<IMdcDatepickerDialogData> = {
      date: this.getDateValue(),
      options: {
        label: this.label,
        format: this.dialogFormat,
        min: this.min,
        max: this.max,
        disableFunction: this.disableFunction,
        disableWeekends: this.disableWeekends,
        firstDay: isNaN(this.firstDay) ? undefined : this.firstDay,
        i18n: this.mdcI18n,
        showAll: this.showAll
      }
    };
    Object.keys(data.options!).filter(key => data.options![key] === undefined).forEach(key => delete data.options![key]);
    if (this.mdcI18n) {
      Object.keys(data.options!.i18n!).filter(key => data.options!.i18n![key] === undefined).forEach(key => delete data.options!.i18n![key]);
    }
    this.element.dispatchEvent(new CustomEvent('open'));
    const result = await this.dialogService.open({ viewModel: MdcDatepickerDialog, model: data });
    this.element.dispatchEvent(new CustomEvent('close'));
    if (result === 'ok') {
      if (data.date) {
        const value = format(data.date, this.getIsoFormat());
        if (this.value !== value) {
          this.value = value;
          this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        }
      } else {
        this.value = '';
      }
    }
    this.input.focus();
  }
}

export interface IMdcDatepickerElement extends IValidatedElement {
  au: {
    controller: {
      viewModel: MdcDatepicker;
    };
  };
}

function defineMdcDatepickerElementApis(element: HTMLElement) {
  Object.defineProperties(element, {
    value: {
      get(this: IMdcDatepickerElement): string {
        return this.au.controller.viewModel.value;
      },
      set(this: IMdcDatepickerElement, value: string) {
        this.au.controller.viewModel.value = value;
      },
      configurable: true
    },
    valid: {
      get(this: IMdcDatepickerElement) {
        return this.au.controller.viewModel.input.valid;
      },
      set(this: IMdcDatepickerElement, value: boolean) {
        this.au.controller.viewModel.input.valid = value;
      },
      configurable: true
    },
    addError: {
      value(this: IMdcDatepickerElement, error: IError) {
        this.au.controller.viewModel.input?.addError(error);
      },
      configurable: true
    },
    removeError: {
      value(this: IMdcDatepickerElement, error: IError) {
        this.au.controller.viewModel.input?.removeError(error);
      },
      configurable: true
    },
    renderErrors: {
      value(this: IMdcDatepickerElement): void {
        this.au.controller.viewModel.input?.renderErrors();
      },
      configurable: true
    }
  });
}
