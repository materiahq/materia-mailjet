import { App, Entity } from '@materia/server';
import { MailjetSender } from '../../lib/mailjet';

class MailjetUser {
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

  list() {
    if (this.mailjet) {
      const user = this.mailjet.get('user');
      return user.request().then(result => result.body.Data);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }
}

module.exports = MailjetUser;
