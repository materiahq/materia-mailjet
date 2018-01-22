const ngcore = (window as any).angular.core;
const Component = ngcore.Component;
const Input = ngcore.Input;
import { OnInit } from "@angular/core";


@Component({
	selector: "materia-mailjet-view",
	templateUrl: "./mailjet-view.component.html",
	styleUrls: ["./mailjet-view.component.scss"]
})
export class MailjetViewComponent implements OnInit {
	codes: any;
	code: any;
	templateSelected: any;
	templates: any;
	nbEmails: any;
	emails = [];
	@Input() app;
	@Input() detectorRef;

	constructor() {
	}

	ngOnInit() {
		console.log("Addon view INIT")
		this.init();
		this.loadTemplates();
	}

	// $scope.AddonsService = AddonsService

	setup() {
		// AddonsService.setup($rootScope.app.addons.get('@materia/mailjet'))
	}

	send(ev) {
		// QueryService.execute($rootScope.app.entities.get('mailjet').getQuery('send'), null, ev)
	}

	/* $rootScope.$on('query::run', (e, data) => {
        if (data.entity == 'mailjet' && data.query == 'send') {
            init()
        }
    })*/

	init() {
		if (this.app && this.app.entities && this.app.entities.get("mailjet")) {
			console.log("Emails get latest query");
			this.app.entities.get("mailjet").getQuery("latest").run().then(emails => {
				console.log("Emails sent :", emails);
				this.emails = [...emails.data];
				this.nbEmails = emails.count;
			}).catch(e => {
				console.log("error", e, e.stack);
			});
		} else {
			setTimeout(() => {
				this.init();
			}, 100);
		}
	}

	loadTemplates() {
		this.app.entities.get("mailjet").getQuery("getTemplates").run().then(files => {
			this.templates = files;
		});
	}

	selectTemplate(template) {
		this.templateSelected = template;
		this.loadPreview(template.code);
	}

	loadPreview(code) {
		console.log("Load preview code : ", code);
		this.code = code.trim();
		console.log("This code :", this.code);
		this.detectorRef.markForCheck();
	}
}
