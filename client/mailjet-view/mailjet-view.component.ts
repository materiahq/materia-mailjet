
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar, MatButtonToggleGroup } from '@angular/material';
import { AddonView } from '@materia/addons';
import { DatePipe } from '@angular/common';
import { TemplateEditorComponent } from '../dialog/template-editor/template-editor.component';

@AddonView('@materia/mailjet')
@Component({
  selector: 'mailjet-view',
  templateUrl: './mailjet-view.component.html',
  styleUrls: ['./mailjet-view.component.scss'],
  providers: []
})
export class MailjetViewComponent implements OnInit {
  nbEmails: any;
  emails = [];

  lastUpdatedCode: any;
  code: string;
  templateSelected: any;
  templateName: any;
  dialogRef: any;

  subject: FormControl;
  body: FormControl;
  to: FormControl;
  templateControl: FormControl;

  data: any[];
  mailjetUser: any;
  statusColors = {
    sent: '#2196F3',
    opened: '#4CAF50',
    clicked: '#8BC34A',
    spam: '#FFC107'
  };
  statsExpanded: boolean;
  contactsExpanded: boolean;
  templatesExpanded: boolean;
  emailsExpanded: boolean;
  contacts: any[];
  templates: any[];
  stats: any = {};

  @Input() app;
  @Input() settings;
  @Input() baseUrl: string;

  @Output() openSetup = new EventEmitter<void>();
  @Output() openInBrowser: EventEmitter<string> = new EventEmitter();

  @ViewChild('sendDialog') sendDialog: TemplateRef<any>;
  @ViewChild('statsButtonGroup') statsButtonGroup: MatButtonToggleGroup;
  @ViewChild(TemplateEditorComponent) templateEditor: TemplateEditorComponent;
  templateDialogRef: any;
  newTemplate: boolean;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.statsExpanded = true;
  }

  openSendDialog() {
    this.subject = new FormControl('[TEST] Subject');
    this.body = new FormControl('');
    this.to = new FormControl('');
    this.dialogRef = this.dialog.open(this.sendDialog);
  }

  openSendToDialog(mail) {
    this.subject = new FormControl('[TEST] Subject');
    this.body = new FormControl('');
    this.to = new FormControl(mail);
    this.dialogRef = this.dialog.open(this.sendDialog);
  }

  send() {
    this.runQuery('mailjet', 'send', { subject: this.subject.value, body: this.body.value, to: this.to.value }).then(() => {
      this.dialogRef.close();
      this.snackBar.open(`Email send`, null, { duration: 2000 });
      this.reload();
    });
  }

  statsTimelineChange(timeline) {
    this.init(timeline);
  }

  reload() {
    this.stats = {};
    this.init('lastWeek');
  }

  init(timeline) {
    const fromTimestamp = this._getTimeline(timeline);
    if ( ! this.stats[timeline]) {
      this.getStats({ FromTS: fromTimestamp }).then(stats => {
        stats = this._fillStats(stats, fromTimestamp);
        this.data = [
          this.getSerie('MessageSentCount', 'Sent', stats),
          this.getSerie('MessageOpenedCount', 'Opened', stats),
          this.getSerie('MessageClickedCount', 'Clicked', stats),
          this.getSerie('MessageSpamCount', 'Spam', stats)
        ];
        this.stats[timeline] = this.data;
      });
    } else {
      this.data = this.stats[timeline];
    }
    this.runQuery('mailjet', 'getMessages', { FromTS: fromTimestamp })
      .then((response: any) => {
        this.emails = [...response.data];
        this.nbEmails = response.count;
      });
    this.runQuery('mailjet', 'getContacts', {FromTS: fromTimestamp}).then((result: any) => {
      this.contacts = result.data;
    });
    this.getMailjetUser().then(() => {
      this.loadTemplates();
    });
  }

  openMailjetTemplateEditor(templateId) {
    this.openInBrowser.emit(`https://app.mailjet.com/template/${templateId}/build`);
  }

  openTemplateEditor(newTemplate) {
    this.newTemplate = newTemplate;
    this.templateEditor.refreshTemplateForm();
    this.templateDialogRef = this.dialog.open(this.templateEditor.template);
  }

  closeTemplateEditor() {
    this.templateDialogRef.close();
  }

  saveTemplate(data) {
    if (this.newTemplate) {
      this._createNewTemplate(data);
    }
  }

  loadTemplates() {
    this.runQuery('mailjet', 'getTemplates', {User: this.mailjetUser.ID}).then((templateResult: any) => {
      this.templates = templateResult.data;
    });
  }

  private _createNewTemplate(data) {
    this.runQuery('mailjet', 'createTemplate',
    {Name: data.name, Author: data.author, Purposes: 'marketing', Locale: this.mailjetUser.Locale})
    .then((result: any) => {
      const newTemplate = result.data[0];
      this.runQuery('mailjet', 'updateTemplateContent', {ID: newTemplate.ID, 'Html-part': `<html>
      <body>
        <h1 style="text-align: center; font-weight: 300; color: #0D47A1; margin: 20px;">
          Template generated via Materia Designer
        </h1>
        <p style=" font-size: 10px; margin-top: 50px; margin-left: 10px;">
          This email was sent to [[EMAIL_TO]],
          <a style="text-decoration: none; color: inherit" href="[[UNSUB_LINK_${this.mailjetUser.Locale.split('_')[1]}]]" target="_blank">
          click here to unsubscribe
          </a>.
        </p>
      </body>
    </html>`,
    Headers: {From: this.settings.name, Subject: 'Subject', 'Reply-To': this.settings.from}})
      .then((templateContent) => {
        this.templateDialogRef.close();
        this.loadTemplates();
        this.openMailjetTemplateEditor(newTemplate.ID);
      });
    });
  }

  private _fillStats(stats, fromTs) {
    const timeUnits = this._getTimeUnits(fromTs);
    const newStats = [];
    timeUnits.forEach(timeUnit => {
      let match = false;
      stats.forEach(stat => {
        if (new Date(timeUnit).getDate() === new Date(stat.Timeslice).getDate()) {
          match = true;
          newStats.push(stat);
        }
      });
      if (!match) {
        newStats.push({ MessageSentCount: 0, MessageSpamCount: 0, MessageOpenedCount: 0, MessageClickedCount: 0, Timeslice: timeUnit });
      }
    });
    return newStats;
  }

  private _getTimeUnits(fromTs) {
    const firstDate = new Date(fromTs);
    const lastDate = new Date();
    const timeUnits = [];
    const daysInterval = (lastDate.getTime() - firstDate.getTime()) / (60 * 60 * 24 * 1000);
    for (let i = 0; i < daysInterval; i++) {
      const currentDate = new Date(fromTs);
      currentDate.setDate(firstDate.getDate() + i);
      timeUnits.push(currentDate.toISOString());
    }
    return timeUnits;
  }

  private _getTimeline(timeline) {
    if (timeline === 'lastWeek') {
      const lastweek = new Date();
      lastweek.setDate(new Date().getDate() - 7);
      return lastweek.toISOString();
    } else if (timeline === 'lastMonth') {
      const lastmonth = new Date();
      lastmonth.setMonth(new Date().getMonth() - 1);
      return lastmonth.toISOString();
    } else if (timeline === 'last3Month') {
      const last3month = new Date();
      last3month.setMonth(new Date().getMonth() - 3);
      return last3month.toISOString();
    }
  }
  private runQuery(entity: string, query: string, params?: any) {
    return this.http
      .post(`${this.baseUrl}/entities/${entity}/queries/${query}`, params)
      .toPromise();
  }

  private getMailjetUser() {
    return this.runQuery('mailjet', 'getUserDetails').then((result: { count: number, data: any }) => {
      this.mailjetUser = result.data[0];
      return this.mailjetUser;
    });
  }

  private getStats(params?) {
    const queryParams = params ?
      Object.assign({}, params, { CounterResolution: 'Day', CounterTiming: 'Message', CounterSource: 'APIKey' })
      : { CounterResolution: 'Day', CounterTiming: 'Message', CounterSource: 'APIKey' };
    return this.runQuery('mailjet', 'getStats', queryParams)
      .then((result: { count: number, data: any }) => {
        return result.data;
      });
  }

  private getSerie(name, displayName, data) {
    const series = [];
    data.forEach(row => {
      series.push({
        name: this.datePipe.transform(row['Timeslice'], 'shortDate'),
        value: row[name]
      });
    });
    return {
      name: displayName,
      series: series
    };
  }
}