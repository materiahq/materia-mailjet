import { App } from '@materia/server';

import { MailjetSender } from '../../lib/mailjet';

class MailjetCampaign {
  mailjetLib: MailjetSender;

  constructor(private app: App) {
      this.mailjetLib = new MailjetSender(this.app);
  }

  list() {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const campaign = this.mailjetLib.mailjet.get('campaign');
      return campaign.request().then(result => {
        return result.body.Data;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }
}

module.exports = MailjetCampaign;
