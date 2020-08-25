import { inject, viewEngineHooks, customAttribute } from 'aurelia-framework';
import { InputmaskCustomAttribute } from 'aurelia-inputmask';
import { MdcTextField } from '@aurelia-mdc-web/text-field';

interface InputmaskMdcTextFieldElement extends HTMLElement {
  au: {
    'inputmask': { viewModel: InputmaskCustomAttribute };
    'mdc-text-field': { viewModel: MdcTextField };
  };
}

// mdc-text-field needs to know when inputmask updates internal input element
@inject(Element)
@customAttribute('mdc-inputmask')
export class MdcInputmaskCustomAttribute {
  constructor(private element: InputmaskMdcTextFieldElement) { }

  attached() {
    this.element.addEventListener('inputmask-change', this);
    this.inputmaskChangeHandler();
  }

  detached() {
    this.element.removeEventListener('inputmask-change', this);
  }

  handleEvent(e: Event) {
    if (e.type === 'inputmask-change') {
      this.inputmaskChangeHandler();
    }
  }

  inputmaskChangeHandler() {
    const inputmask = this.element.au['inputmask']?.viewModel;
    const input = this.element.au['mdc-text-field']?.viewModel;
    if (inputmask && input) {
      input.value = inputmask.input.value;
    }
  }
}

@viewEngineHooks
export class EnhanceMask {
  beforeCompile(template: DocumentFragment) {
    const inputs = template.querySelectorAll('[inputmask]');
    for (const i of Array.from(inputs)) {
      i.setAttribute('mdc-inputmask', '');
    }
  }
}
