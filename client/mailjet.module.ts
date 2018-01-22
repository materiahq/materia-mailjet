// External modules
// const CommonModule = (window as any).angular.common.CommonModule;
const CommonModule = (window as any).angular.common.CommonModule;

const NgModule = (window as any).angular.core.NgModule;
// Angular CDK
// Angular material
const MatButtonModule = (window as any).angular.material.MatButtonModule;
const MatCardModule = (window as any).angular.material.MatCardModule;
const MatIconModule = (window as any).angular.material.MatIconModule;
const MatTooltipModule = (window as any).angular.material.MatTooltipModule;
const MatListModule = (window as any).angular.material.MatListModule;
const MatProgressBarModule = (window as any).angular.material.MatProgressBarModule;
const MatProgressSpinnerModule = (window as any).angular.material.MatProgressBarModule;
const MatTabsModule = (window as any).angular.material.MatTabsModule;


const FlexLayoutModule = (window as any).angular.flexLayout.FlexLayoutModule;
const SharedModule = (window as any).shared;

// Components and directives
import { MailjetViewComponent } from "./components";

// Addon class
// export { UserManagementAddon } from "./user-management.addon";

@NgModule({
	imports: [
		// Angular modules
		CommonModule,

		FlexLayoutModule,

		// Material modules
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatListModule,
		MatTooltipModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		SharedModule
	],
	exports: [MailjetViewComponent],
	declarations: [MailjetViewComponent],
	entryComponents: [MailjetViewComponent],
	providers: []
})
export class MailjetModule {
	static getViewComponent() {
		return MailjetViewComponent;
	}
}