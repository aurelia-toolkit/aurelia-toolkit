import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export function configure(frameworkConfiguration: FrameworkConfiguration) {
  frameworkConfiguration.globalResources([
    PLATFORM.moduleName('./at-headered-content')
  ]);
}
