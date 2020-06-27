import { App } from '@materia/server';

import { MailjetService } from '../../lib/mailjet';

class MailjetUser {
  mailjetLib: MailjetService;

  constructor(private app: App) {
    this.mailjetLib = new MailjetService(this.app);
  }

  list() {
    this.mailjetLib.checkApi();
    const userListRequest = this.mailjetLib.api.get('user').request();
    return userListRequest.then(({ body: { Data } }) => Data);
  }
}

module.exports = MailjetUser;
