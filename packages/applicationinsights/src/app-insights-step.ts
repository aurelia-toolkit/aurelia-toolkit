import * as au from "../aurelia";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

@au.autoinject
export class AppInsightsStep implements au.PipelineStep {
	constructor(private appInsights: ApplicationInsights) {
		this.logger = au.getLogger("AppInsightsStep");
		this.logger.debug("Created");
	}

	logger: au.Logger;

	run(navigationInstruction: au.NavigationInstruction, next: au.Next) {
		let origin = window.location.pathname + window.location.hash;
		let path = origin.replace("/#/", "/").replace("#", "");
		this.logger.debug(`Tracking for ${path}`);
		this.appInsights.trackPageView({ name: navigationInstruction.config.name, uri: path, properties: navigationInstruction.params });
		return next();
	}
}
