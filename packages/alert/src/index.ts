import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export { AlertService } from './alert-service';

export function configure(frameworkConfiguration: FrameworkConfiguration) {
  frameworkConfiguration.globalResources([
    PLATFORM.moduleName('./global-progress/global-progress'),
    PLATFORM.moduleName('./alert-modal/alert-modal')
  ]);
}
