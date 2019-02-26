import { App } from '@materia/server';

import { MailjetSender } from '../../lib/mailjet';

class MailjetUser {
  mailjetLib: MailjetSender;

  constructor(private app: App) {
    this.mailjetLib = new MailjetSender(this.app);
  }

  list() {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const user = this.mailjetLib.mailjet.get('user');
      return user.request().then(result => result.body.Data);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }
}

module.exports = MailjetUser;
