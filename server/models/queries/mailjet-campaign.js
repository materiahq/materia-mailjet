const MailjetSender = require('../../lib/mailjet')

class MailjetCampaign {
	constructor(app, entity) {
		this.app = app;
		this.entity = entity;
		if (app.addons && app.addonsConfig) {
			const mailjetConfig = app.addons.addonsConfig['@materia/mailjet'];
			if (mailjetConfig && mailjetConfig.apikey && mailjetConfig.secret && mailjetConfig.from && mailjetConfig.name) {
				this.mailjetLib = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name);
				this.mailjet = this.emailSender.mailjet;
			}
		}
	}

	list() {
		if (this.mailjet) {
			var campaign = this.mailjet.get('campaign');
			return campaign.request()
				.then((result) => {
					return result.body.Data;
				});
		} else {
			return { message: 'Error: @materia/mailjet config not found' };
		}
	}
}

module.exports = MailjetCampaign;
