import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { inject } from 'aurelia-framework';
import { PipelineStep, NavigationInstruction, Next } from 'aurelia-router';

@inject(ApplicationInsights)
export class AppInsightsStep implements PipelineStep {
  constructor(private appInsights: ApplicationInsights) { }

  async run(navigationInstruction: NavigationInstruction, next: Next) {
    const origin = window.location.pathname + window.location.hash;
    const path = origin.replace('/#/', '/').replace('#', '');
    this.appInsights.trackPageView({ name: navigationInstruction.config.name, uri: path, properties: navigationInstruction.params });
    return next();
  }
}
