
import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, TemplateRef } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
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
	nbEmails: any;
	emails = [];

	lastUpdatedCode: any;
	code: string;
	templateSelected: any;
	templates: any;
	templateName: any;
	dialogRef: any;

	subject: FormControl;
	body: FormControl;
	to: FormControl;
	templateControl: FormControl;

	@Input() app;
	@Input() settings;
	@Input() baseUrl: string;

	@Output() openSetup = new EventEmitter<void>();

	@ViewChild('templateDialog') templateDialog: TemplateRef<any>;
	@ViewChild('sendDialog') sendDialog: TemplateRef<any>;
	@ViewChild('sendTemplateDialog') sendTemplateDialog: TemplateRef<any>;

	constructor(
		@Inject('HttpClient') private http: HttpClient,
		@Inject('MatDialog') private dialog: MatDialog,
		@Inject('MatSnackBar') private snackBar: MatSnackBar
	) {

	}

	ngOnInit() {
		this.init();
		this.loadTemplates();
	}

	init() {
		this.runQuery('mailjet', 'latest')
			.then(response => {
				this.emails = [...response.data];
				this.nbEmails = response.count;
			})
	}

	loadTemplates() {
		this.runQuery('mailjet', 'getTemplates').then(result => {
			this.templates = result.data;
		});
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
			this.loadTemplates()
			this.snackBar.open(`${this.templateSelected.name} save`, null, { duration: 2000 });
		}).catch(err => console.log("Error saving template : ", err));
	}

	openSendDialog() {
		this.subject = new FormControl('');
		this.body = new FormControl('');
		this.to = new FormControl('');
		this.dialogRef = this.dialog.open(this.sendDialog);
	}

	send() {
		this.runQuery('mailjet', 'send', { subject: this.subject.value, body: this.body.value, to: this.to.value }).then(() => {
			this.dialogRef.close();
			this.snackBar.open(`Email send`, null, { duration: 2000 });
			this.init();
		});
	}

	openSendTemplateDialog() {
		this.subject = new FormControl('');
		this.templateControl = new FormControl(this.templates[0].name);
		this.to = new FormControl('');
		const dialogRef = this.dialog.open(this.sendTemplateDialog);
	}

	sendTemplate() {
		const template = this.templates.find(t => t.name === this.templateControl.value);
		this.runQuery('mailjet', 'sendTemplate', { subject: this.subject.value, body: template.code, to: this.to.value }).then(() => {
			this.dialogRef.close();
			this.snackBar.open(`Email send`, null, { duration: 2000 });
			this.init();
		});
	}

	selectTemplate(template) {
		this.templateSelected = Object.assign({}, template, {editorVisible: true, previewVisible: true});
		this.lastUpdatedCode = template.code;
	}

	lastCodeEv(ev) {
		this.lastUpdatedCode = ev;
	}

	loadPreview(code) {
		this.code = code;
	}

	newTemplate() {
		this.templateName = new FormControl('')
		this.dialogRef = this.dialog.open(this.templateDialog);
	}

	addTemplate() {
		this.dialogRef.close();
		this.runQuery('mailjet', 'saveTemplate', { name: `${this.templateName.value}.html`, content: `<div style="text-align: center"><h1>New ${this.templateName.value} template</h1></div>` })
			.then(() => {
				this.snackBar.open(`${this.templateName.value}.html save`, null, { duration: 2000 });
				this.loadTemplates();
			}).catch(err => console.log('Error saving template : ', err))
	}

	private runQuery(entity: string, query: string, params?: any) {
		return this.http
			.post(`${this.baseUrl}/entities/${entity}/queries/${query}`, params)
			.toPromise()
	}
}