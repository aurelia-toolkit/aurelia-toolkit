/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { useView, PLATFORM, customElement, inject, TaskQueue } from 'aurelia-framework';
import { IMdcTextFieldElement } from '@aurelia-mdc-web/text-field';
import { IValidatedElement, IError } from '@aurelia-mdc-web/base';
import { bindable } from 'aurelia-typed-observable-plugin';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { InputmaskCustomAttribute } from 'aurelia-inputmask';
import { MdcDialogService } from '@aurelia-mdc-web/dialog';
import { MdcDatepickerDialog } from '../mdc-datepicker-dialog/mdc-datepicker-dialog';
import { IMdcDatepickerDialogData, IMdcDatepickerDialogOptions } from '../mdc-datepicker-dialog/i-mdc-datepicker-dialog-options';

const DATE_ISO_FORMAT = 'yyyy-MM-dd';
const DATETIME_ISO_FORMAT = 'yyyy-MM-dd\'T\'HH:mm:ss';

@inject(Element, TaskQueue, MdcDialogService)
@customElement('mdc-datepicker')
@useView(PLATFORM.moduleName('./mdc-datepicker.html'))
export class MdcDatepicker {
  constructor(private element: HTMLElement, private taskQueue: TaskQueue, private dialogService: MdcDialogService) {
    defineMdcDatepickerElementApis(this.element);
  }

  input: IMdcTextFieldElement;
  inputmask: InputmaskCustomAttribute;
  inputmaskValue: string;
  _value: string;

  @bindable
  label: string;

  @bindable
  format: string = 'dd/MM/yyyy';

  @bindable
  inputmaskFormat: string = 'dd/mm/yyyy';

  @bindable
  dialogFormat: string = 'E, MMM d';

  @bindable.date
  min: Date;

  @bindable.date
  max: Date;

  @bindable
  disableFunction: (d: Date) => boolean;

  @bindable.booleanAttr
  disableWeekends: boolean;

  @bindable.booleanAttr
  showAll: boolean;

  @bindable.number
  firstDay: number;

  @bindable
  mdcI18n: IMdcDatepickerDialogOptions['i18n'];

  @bindable.booleanAttr
  readonly: boolean;

  @bindable.booleanAttr
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

  handleBlur() {
    this.element.dispatchEvent(new CustomEvent('change'));
  }

  handleChange(e: Event) {
    e.cancelBubble = true;
    this.taskQueue.queueTask(() => this.element.dispatchEvent(new CustomEvent('change')));
  }

  handleInput(e: Event) {
    e.cancelBubble = true;
    this.taskQueue.queueTask(() => this.element.dispatchEvent(new CustomEvent('input')));
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
        this.value = format(data.date, this.getIsoFormat());
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
