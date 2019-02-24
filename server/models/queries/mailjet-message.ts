import { MailjetSender } from '../../lib/mailjet';
import { App, Entity } from '@materia/server';

class MailjetMessage {
  mailjetLib: MailjetSender;
  mailjet: any;

  constructor(private app: App, private entity: Entity) {
    if (this.app.addons && this.app.addons.addonsConfig) {
      const mailjetConfig = this.app.addons.addonsConfig['@materia/mailjet'];
      if (
        mailjetConfig &&
        mailjetConfig.apikey &&
        mailjetConfig.secret &&
        mailjetConfig.from &&
        mailjetConfig.name
      ) {
        this.mailjetLib = new MailjetSender(
          app.addons.addonsConfig['@materia/mailjet'].apikey,
          app.addons.addonsConfig['@materia/mailjet'].secret,
          app.addons.addonsConfig['@materia/mailjet'].from,
          app.addons.addonsConfig['@materia/mailjet'].name
        );
        this.mailjet = this.mailjetLib.mailjet;
      }
    }
  }

  list(params) {
    if (this.mailjet) {
      const message = this.mailjet.get('message');
      if (!params.FromTS) {
        const lastweek = new Date();
        lastweek.setDate(new Date().getDate() - 7);
        params.FromTS = lastweek.toISOString();
      }
      if (!params.ToTS) {
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
    if (this.mailjetLib) {
      return this.mailjetLib.send(params).then(result => {
        return result.body;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  sendTemplate(params) {
    if (this.mailjetLib) {
      return this.mailjetLib.sendTemplate(params).then(result => {
        return result.body;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }
}

module.exports = MailjetMessage;
