const ngcore = (window as any).angular.core;
const Component = ngcore.Component;
const Input = ngcore.Input;
const Output = ngcore.Output;

import { OnInit, EventEmitter } from "@angular/core";

@Component({
	selector: "materia-mailjet-view",
	templateUrl: "./mailjet-view.component.html",
	styleUrls: ["./mailjet-view.component.scss"]
})
export class MailjetViewComponent implements OnInit {
	lastUpdatedCode: any;
	code: string;
	templateSelected: any;
	templates: any;
	nbEmails: any;
	emails = [];
	@Input() app;

	@Output() openSetup = new EventEmitter<void>();

	constructor() {}

	ngOnInit() {
		console.log("Addon view INIT");
		this.init();
		this.loadTemplates();
	}

	cancel() {
		console.log("Click cancel");
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

			this.app.entities.get("mailjet").getQuery("latest").run().then(emails => {
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
		this.templateSelected = Object.assign({}, template);
		this.lastUpdatedCode = template.code;
		this.loadPreview(template.code);
	}

	lastCodeEv(ev) {
		this.lastUpdatedCode = ev;
		return this.loadPreview(ev);
	}

	loadPreview(code) {
		this.code = code;
	}
}
