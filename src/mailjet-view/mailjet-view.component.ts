
import { Component, OnInit, NgModule, Input, Output, EventEmitter } from "@angular/core";
import { Addon } from '@materia/addons';
//import { MatSnackBarModule, MatSnackBar } from '@angular/material';

@Addon({
	package: "@materia/mailjet",
	name: "Mailjet",
	logo: "https://thyb.github.io/materia-website-content/logo/addons/mailjet.jpg",
	deps: []
})
@Component({
	selector: "materia-mailjet-view",
	templateUrl: "./mailjet-view.component.html",
	styleUrls: ["./mailjet-view.component.scss"],
	providers: []
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

	constructor() { }

	ngOnInit() {
		this.init();
		this.loadTemplates();
	}

	cancel() {
		this.templateSelected = null;
		this.lastUpdatedCode = null;
	}

	saveTemplate() {
		if (this.app && this.app.entities && this.app.entities.get("mailjet")) {
			this.app.entities.get("mailjet").getQuery("saveTemplate").run({ name: this.templateSelected.name, content: this.lastUpdatedCode }).then(result => {
				this.templateSelected.code = this.lastUpdatedCode;
				/*MatSnackBar.open("File successfully saved", "save", {
					duration: 1500
				})*/
			}).catch(err => console.log("Error saving template : ", err));
		}
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
	}

	lastCodeEv(ev) {
		this.lastUpdatedCode = ev;
	}

	loadPreview(code) {
		this.code = code;
	}

}