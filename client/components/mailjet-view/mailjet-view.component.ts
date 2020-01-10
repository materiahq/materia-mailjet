import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AddonView } from '@materia/addons';
import { filter } from 'rxjs/operators';

import { TemplateEditorComponent } from '../../dialogs/template-editor/template-editor.component';
import { SendModalComponent } from '../../dialogs/send-modal/send-modal.component';

@AddonView('@materia/mailjet')
@Component({
  selector: 'mailjet-view',
  templateUrl: './mailjet-view.component.html',
  styleUrls: ['./mailjet-view.component.scss']
})
export class MailjetViewComponent implements OnInit, OnChanges {
  @Input() app;
  @Input() settings;
  @Input() baseUrl: string;

  @Output() openSetup = new EventEmitter<void>();
  @Output() openInBrowser: EventEmitter<string> = new EventEmitter();
  @Output() snackbarSuccess = new EventEmitter<string>();
  @Output() snackbarError = new EventEmitter<any>();

  nbEmails: number;
  emails = [];
  contacts: any[];
  templates: any[];

  sendDialogRef: MatDialogRef<SendModalComponent>;
  templateDialogRef: MatDialogRef<TemplateEditorComponent>;

  data: any[];
  stats: any = {};
  mailjetUser: any;
  statusColors = {
    sent: '#2196F3',
    opened: '#4CAF50',
    clicked: '#8BC34A',
    spam: '#FFC107',
    bounce: '#F44336',
    blocked: 'black'
  };
  statsExpanded: boolean;
  contactsExpanded: boolean;
  templatesExpanded: boolean;
  emailsExpanded: boolean;
  statsProcessing: boolean;
  timeUnits: string[];
  loadingError = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.statsExpanded = true;
    if (this.settings.secret && this.settings.apikey) {
      this.statsProcessing = true;
    }
  }

  ngOnChanges(changes) {
    console.log('Changes : ', changes);
  }

  openSendDialog(type, templateSelected?) {
    this.sendDialogRef = this.dialog.open(SendModalComponent, {
      panelClass: 'no-padding'
    });
    this.sendDialogRef.componentInstance.subject = '[TEST] Subject';
    this.sendDialogRef.componentInstance.type = type;
    if (type === 'template' && templateSelected) {
      this.sendDialogRef.componentInstance.templateId = templateSelected;
    }
    this.sendDialogRef.componentInstance.templates = this.templates;
    this.sendDialogRef.afterClosed()
      .pipe(filter(result => result !== 'cancel'))
      .subscribe(this.send);
  }

  openSendToDialog(mail) {
    this.sendDialogRef = this.dialog.open(SendModalComponent, {
      panelClass: 'no-padding'
    });
    this.sendDialogRef.componentInstance.subject = '[TEST] Subject';
    this.sendDialogRef.componentInstance.type = 'simple';
    this.sendDialogRef.componentInstance.to = mail;
    this.sendDialogRef.componentInstance.templates = this.templates;
    this.sendDialogRef.afterClosed()
      .pipe(filter(result => result !== 'cancel'))
      .subscribe(this.send);
  }

  send(data) {
    if (data.type === 'simple') {
      this._sendSimpleMessage(data);
    } else {
      this._sendTemplateMessage(data);
    }
  }

  statsTimelineChange(timeline) {
    if (timeline && timeline === 'lastWeek' || timeline === 'lastMonth') {
      this.init(timeline);
    }
  }

  reload() {
    this.stats = {};
    this.init('lastWeek');
  }

  init(timeline) {
    const fromTimestamp = this._getTimeline(timeline);
    this.statsProcessing = true;
    this.loadingError = false;
    return this.getStats({ FromTS: fromTimestamp })
      .then(stats => {
        if (stats && stats.length) {
          stats = this._fillStats(stats, fromTimestamp);
          this.data = [
            this.getSerie('MessageSentCount', 'Sent', stats),
            this.getSerie('MessageOpenedCount', 'Opened', stats),
            this.getSerie('MessageClickedCount', 'Clicked', stats),
            this.getSerie('MessageSpamCount', 'Spam', stats),
            this.getSerie('MessageHardBouncedCount', 'Bounce', stats),
            this.getSerie('MessageBlockedCount', 'Blocked', stats)
          ];
          this.stats[timeline] = this.data;
          setTimeout(() => {
            this.statsProcessing = false;
          }, 1000);
        } else {
          this.data = [];
          this.statsProcessing = false;
        }
        return this.runQuery('mailjet_message', 'list', {
          FromTS: fromTimestamp,
          limit: 100
        });
      })
      .then((messagesResponse: any) => {
        this.emails = [...messagesResponse.data.reverse()];
        this.nbEmails = messagesResponse.count;
        return this.runQuery('mailjet_contact', 'list', {
          FromTS: fromTimestamp,
          limit: 100
        });
      })
      .then((result: any) => {
        this.contacts = result.data;
        return this.getMailjetUser();
      })
      .then(() => {
        this.loadTemplates();
      })
      .catch(_ => {
        this.loadingError = true;
        this.statsProcessing = false;
      });
  }

  openMailjetTemplateEditor(template) {
    this.openInBrowser.emit(
      `https://app.mailjet.com/template/${template.ID}/${
        template.EditMode === 1 ? 'build' : 'html'
      }`
    );
  }

  openTemplateEditor(newTemplate) {
    this.templateDialogRef = this.dialog.open(TemplateEditorComponent, {
      panelClass: 'no-padding'
    });
    this.templateDialogRef.componentInstance.edition = newTemplate;
    this.templateDialogRef.componentInstance.user = this.mailjetUser;
    this.templateDialogRef.componentInstance.settings = this.settings;
    this.templateDialogRef.afterClosed().
      pipe(filter(result => result))
      .subscribe(this.saveTemplate);
  }

  saveTemplate(data) {
    this._createNewTemplate(data);
  }

  loadTemplates() {
    Promise.all([
      this.runQuery('mailjet_template', 'findAll', {
        OwnerType: 'user',
        Limit: 100
      }),
      this.runQuery('mailjet_template', 'findAll', {
        OwnerType: 'apikey',
        Limit: 100
      })
    ]).then(([templateResult1, templateResult2]: any) => {
      this.templates = [...templateResult1.data, ...templateResult2.data];
    });
  }

  openMailjetSignup() {
    this.openInBrowser.emit('https://app.mailjet.com/signup');
  }

  openMailjetApikeyPage() {
    this.openInBrowser.emit('https://app.mailjet.com/account/api_keys');
  }

  private _createNewTemplate(data) {
    this.runQuery('mailjet_template', 'create', {
      Name: data.name,
      Author: data.author,
      Purposes: data.templateType,
      Locale: this.mailjetUser.Locale
    }).then((result: any) => {
      const newTemplate = result.data[0];
      this.runQuery('mailjet_template', 'updateContent', {
        ID: newTemplate.ID,
        'Html-part': `<html>
      <body>
        <h1 style="text-align: center; font-weight: 300; color: #0D47A1; margin: 20px;">
          Template generated via Materia Designer
        </h1>
        <p style=" font-size: 10px; margin-top: 50px; margin-left: 10px;">
          This email was sent to [[EMAIL_TO]],
          <a style="text-decoration: none; color: inherit" href="[[UNSUB_LINK_${
            this.mailjetUser.Locale.split('_')[1]
          }]]" target="_blank">
          click here to unsubscribe
          </a>.
        </p>
      </body>
    </html>`,
        Headers: {
          From: `${this.settings.name} <${this.settings.from}>`,
          Subject: 'Subject',
          'Reply-To': this.settings.from
        }
      }).then(_ => {
        this.templateDialogRef.close();
        this.loadTemplates();
        this.openMailjetTemplateEditor(newTemplate);
      });
    });
  }

  private _fillStats(stats, fromTs) {
    const timeUnits = this._getTimeUnits(fromTs);
    this.timeUnits = timeUnits.map(d => {
      return this.datePipe.transform(d, 'shortDate');
    });
    const newStats = [];
    timeUnits.forEach(timeUnit => {
      let match = false;
      stats.forEach(stat => {
        const timeUnitDate = new Date(timeUnit);
        timeUnitDate.setHours(0, 0, 0, 0);
        const statDate = new Date(stat.Timeslice);
        statDate.setHours(0, 0, 0, 0);
        if (timeUnitDate.toISOString() === statDate.toISOString()) {
          match = true;

          newStats.push(stat);
        }
      });
      if (!match) {
        newStats.push({
          MessageSentCount: 0,
          MessageSpamCount: 0,
          MessageOpenedCount: 0,
          MessageClickedCount: 0,
          MessageHardBouncedCount: 0,
          MessageBlockedCount: 0,
          Timeslice: timeUnit
        });
      }
    });
    return newStats;
  }

  private _getTimeUnits(fromTs) {
    const firstDate = new Date(fromTs);
    const lastDate = new Date();
    const timeUnits = [];
    const daysInterval =
      (lastDate.getTime() - firstDate.getTime()) / (60 * 60 * 24 * 1000);
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

  private _sendSimpleMessage(data) {
    this.runQuery('mailjet_message', 'send', {
      subject: data.subject,
      body: data.body,
      to: data.to,
      error_reporting: true
    })
      .then(() => {
        this.sendDialogRef.close();
        this.snackbarSuccess.emit('Email successfully send');
        this.reload();
      })
      .catch(err => this.snackbarError.emit(err));
  }

  private _sendTemplateMessage(data) {
    const variables: any = {};
    data.variables.forEach((variable) => variables[variable.name] = variable.value);
    this.runQuery('mailjet_message', 'sendTemplate', {
      templateId: data.template,
      subject: data.subject,
      to: data.to,
      variables: Object.keys(variables).length ? variables : null,
      error_reporting: true
    })
      .then(() => {
        this.sendDialogRef.close();
        this.snackbarSuccess.emit('Email successfully send');
        this.reload();
      })
      .catch(err => this.snackbarError.emit(err));
  }

  private runQuery(entity: string, query: string, params?: any) {
    return this.http
      .post(`${this.baseUrl}/entities/${entity}/queries/${query}`, params)
      .toPromise();
  }

  private getMailjetUser() {
    return this.runQuery('mailjet_user', 'list').then(
      (result: { count: number; data: any }) => {
        this.mailjetUser = result.data[0];
        return this.mailjetUser;
      }
    );
  }

  private getStats(params?) {
    const queryParams = params
      ? Object.assign({}, params, {
          CounterResolution: 'Day',
          CounterTiming: 'Message',
          CounterSource: 'APIKey'
        })
      : {
          CounterResolution: 'Day',
          CounterTiming: 'Message',
          CounterSource: 'APIKey'
        };
    return this.runQuery('mailjet_statistic', 'find', queryParams).then(
      (result: { count: number; data: any }) => result.data
    );
  }

  private getSerie(name, displayName, data) {
    const series = [];
    data.forEach(row => {
      series.push(row[name]);
    });
    return {
      name: displayName,
      data: series,
      type: 'line',
      color: this.statusColors[displayName.toLowerCase()]
    };
  }
}
