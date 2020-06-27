import { App } from '@materia/server';

import { MailjetService } from '../../lib/mailjet';

class MailjetCampaign {
  mailjetLib: MailjetService;

  constructor(private app: App) {
    this.mailjetLib = new MailjetService(this.app);
  }

  list(params) {
    this.mailjetLib.checkApi();
    const campaign = this.mailjetLib.api.get('campaign');
    return campaign.request(params).then(({ body: { Data }}) => Data);
  }
}

module.exports = MailjetCampaign;
