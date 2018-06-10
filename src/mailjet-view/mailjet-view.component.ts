
import { Component, OnInit, Input, Output, EventEmitter, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Addon } from '@materia/addons';
//import { MatSnackBarModule, MatSnackBar } from '@angular/material';

@Addon({
	package: "@materia/mailjet",
	name: "Mailjet",
	logo: "https://thyb.github.io/materia-website-content/logo/addons/mailjet.jpg",
	deps: [ ]
})
@Component({
	selector: "materia-mailjet-view",
	templateUrl: "./mailjet-view.component.html",
	styleUrls: ["./mailjet-view.component.scss"],
	providers: [ ]
})
export class MailjetViewComponent implements OnInit {
	lastUpdatedCode: any;
	code: string;
	templateSelected: any;
	templates: any;
	nbEmails: any;
	emails = [];
	@Input() app;
	@Input() settings;
	@Input() baseUrl: string;

	@Output() openSetup = new EventEmitter<void>();

	constructor(
		@Inject('HttpClient') private http: HttpClient
	) { }

	ngOnInit() {
		this.init();
		this.loadTemplates();
	}

	cancel() {
		this.templateSelected = null;
		this.lastUpdatedCode = null;
	}

	saveTemplate() {
		this.runQuery('mailjet', 'saveTemplate', {
			name: this.templateSelected.name,
			content: this.lastUpdatedCode 
		}).then(result => {
			this.templateSelected.code = this.lastUpdatedCode;
			/*MatSnackBar.open("File successfully saved", "save", {
				duration: 1500
			})*/
		}).catch(err => console.log("Error saving template : ", err));
	}

	send(ev) {
		// QueryService.execute($rootScope.app.entities.get('mailjet').getQuery('send'), null, ev)
	}

	init() {
		this.runQuery('mailjet', 'latest')
			.then(response => {
				this.emails = [...response.data];
				this.nbEmails = response.count;
			})
	}

	loadTemplates() {
		this.runQuery('mailjet', 'getTemplates').then(files => {
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

	private runQuery(entity: string, query: string, params?: any) {
		return this.http
			.post(`${this.baseUrl}/entities/${entity}/queries/${query}`, {
				params: params
			})
			.toPromise()
	}
}