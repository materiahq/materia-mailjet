import { App } from '@materia/server';

import { MailjetSender } from '../../lib/mailjet';

class MailjetMessage {
  mailjetLib: MailjetSender;

  constructor(private app: App) {
    this.mailjetLib = new MailjetSender(this.app);
  }

  list(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const message = this.mailjetLib.mailjet.get('message');
      if ( ! params || ! Object.keys(params).length) {
        const lastweek = new Date();
        lastweek.setDate(new Date().getDate() - 7);
        params.FromTS = lastweek.toISOString();
        const now = new Date();
        params.ToTS = now.toISOString();
      }
      const newParams = Object.assign(
        {},
        {
          ShowSubject: true,
          ShowContactAlt: true,
          Sort: 'ArrivedAt'
        },
        params
      );
      return message.request(newParams).then(result => {
        return result.body.Data;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  send(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      return this.mailjetLib.send(params).then(result => {
        return result.body;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  sendTemplate(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      return this.mailjetLib.sendTemplate(params).then(result => {
        return result.body;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }
}

module.exports = MailjetMessage;
