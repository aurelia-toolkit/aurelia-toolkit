import { AtHeaderedContent } from './at-headered-content';
import { IContainer } from 'aurelia';

let registered = false;

export const HeaderedContentConfiguration = {
  register(container: IContainer): IContainer {
    if (registered) {
      return container;
    } else {
      registered = true;
      return container.register(AtHeaderedContent);
    }
  }
};
