import {
  customElement, processContent, ViewCompiler, ViewResources, BehaviorInstruction,
  ViewCompileInstruction, PLATFORM, useView
} from 'aurelia-framework';
import { FilterLineBase } from '../filter-line-base';
import { bindable } from 'aurelia-typed-observable-plugin';
import { MdcFilterConfiguration } from '../mdc-filter-configuration';
import templateHtml from './lookup-filter-line.html';

@customElement('lookup-filter-line')
@processContent(LookupFilterLine.processContent)
@useView(PLATFORM.moduleName('./lookup-filter-line.html'))
export class LookupFilterLine extends FilterLineBase<unknown> {
  constructor(element: Element, config: MdcFilterConfiguration) {
    super(element);
    this.operators = [...config.lookupOperators];
  }

  // slots cannot be used inside <template replace-part> hence this custom processing
  static processContent(viewCompiler: ViewCompiler, _resources: ViewResources, element: Element, instruction: BehaviorInstruction) {
    const elementResource = instruction.type;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viewResources = (elementResource as any).viewFactory.resources;
    const shouldCreateFactory = element.children.length > 0;
    // inside this if, we are going to create a new factory to supply
    // to the creation of the custom element
    if (shouldCreateFactory) {
      const compileInstruction = new ViewCompileInstruction(/* shadow DOM? */false, true);
      const template = templateHtml.replace('<slot></slot>', element.innerHTML);
      const viewFactory = viewCompiler.compile(template, viewResources, compileInstruction);
      // override default view factory
      // Aurelia fallbacks to instruction view factory if there's any
      instruction.viewFactory = viewFactory;
      // save content to use later for cloned filter items
      element.setAttribute('content', element.innerHTML);
      // only use the content as template
      // remove all after use to avoid undesirable visual
      element.innerHTML = '';
    }
    return false;
  }

  @bindable
  options: ((filter: string, value: unknown) => Promise<unknown[]>) | unknown[] | undefined;

  @bindable
  displayField: ((option: unknown) => string) | string | undefined;

  @bindable
  valueField: ((option: unknown) => unknown) | string | undefined;

  @bindable.booleanAttr
  twoLine: boolean;

  @bindable.booleanAttr
  preloadOptions: boolean;

  @bindable.booleanAttr
  virtual: boolean;

  hydrateInternal(fl: LookupFilterLine) {
    this.options = fl.options;
    this.displayField = fl.displayField;
    this.valueField = fl.valueField;
    this.twoLine = fl.twoLine;
    this.preloadOptions = fl.preloadOptions;
    this.virtual = fl.virtual;
  }
}
