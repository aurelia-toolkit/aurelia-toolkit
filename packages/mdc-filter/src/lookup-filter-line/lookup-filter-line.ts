import { FilterLineBase } from '../filter-line-base';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';
// import templateHtml from './lookup-filter-line.html?raw';
import { IMdcTextFieldElement } from '@aurelia-mdc-web/text-field';
import template from './lookup-filter-line.html?raw';
import { bindable, customElement, inject } from 'aurelia';
import { booleanAttr } from '@aurelia-mdc-web/base';

@inject(Element, MdcFilterConfiguration)
@customElement({ name: 'lookup-filter-line', template })
  // slots cannot be used inside <template replace-part> hence this custom processing
// @processContent(function processContent(node: HTMLElement, platform: IPlatform, data: Record<PropertyKey, unknown>) {
//   const elementResource = instruction.type;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const viewResources = (elementResource as any).viewFactory.resources;
//   const shouldCreateFactory = node.children.length > 0;
//   // inside this if, we are going to create a new factory to supply
//   // to the creation of the custom element
//   if (shouldCreateFactory) {
//     const compileInstruction = new ViewCompileInstruction(/* shadow DOM? */false, true);
//     const template = templateHtml.replace('<slot></slot>', node.innerHTML);
//     const viewFactory = viewCompiler.compile(template, viewResources, compileInstruction);
//     // override default view factory
//     // Aurelia fallbacks to instruction view factory if there's any
//     instruction.viewFactory = viewFactory;
//     // save content to use later for cloned filter items
//     node.setAttribute('content', node.innerHTML);
//     // only use the content as template
//     // remove all after use to avoid undesirable visual
//     node.innerHTML = '';
//   }
//   return false;
// })
export class LookupFilterLine extends FilterLineBase<unknown> {
  constructor(element: Element, config: MdcFilterConfiguration) {
    super(element);
    this.operators = [...config.lookupOperators];
  }


  input: IMdcTextFieldElement;

  @bindable
  options: ((filter: string, value: unknown) => Promise<unknown[]>) | unknown[] | undefined;

  @bindable
  displayField: ((option: unknown) => string) | string | undefined;

  @bindable
  valueField: ((option: unknown) => unknown) | string | undefined;

  @bindable({ set: booleanAttr })
  twoLine: boolean;

  @bindable({ set: booleanAttr })
  preloadOptions: boolean;

  @bindable({ set: booleanAttr })
  virtual: boolean;

  override errorChanged() {
    this.input.valid = !this.error;
  }

  hydrateInternal(fl: LookupFilterLine) {
    this.options = fl.options;
    this.displayField = fl.displayField;
    this.valueField = fl.valueField;
    this.twoLine = fl.twoLine;
    this.preloadOptions = fl.preloadOptions;
    this.virtual = fl.virtual;
  }
}
