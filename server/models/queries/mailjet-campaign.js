const MailjetSender = require('../../lib/mailjet');

class MailjetCampaign {
	constructor(app, entity) {
		this.app = app;
		this.entity = entity;
		if (this.app.addons && this.app.addons.addonsConfig) {
			const mailjetConfig = this.app.addons.addonsConfig['@materia/mailjet'];
			if (mailjetConfig && mailjetConfig.apikey && mailjetConfig.secret && mailjetConfig.from && mailjetConfig.name) {
				this.mailjetLib = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name);
				this.mailjet = this.mailjetLib.mailjet;
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
			return Promise.reject(new Error('Addon @materia/mailjet not configured'));
		}
	}
}

module.exports = MailjetCampaign;
