const MailjetSender = require('../../lib/mailjet')

class MailjetStatistic {
	constructor(app, entity) {
		this.app = app;
		this.entity = entity;
		if (app.addons && app.addonsConfig) {
			const mailjetConfig = app.addons.addonsConfig['@materia/mailjet'];
			if (mailjetConfig && mailjetConfig.apikey && mailjetConfig.secret && mailjetConfig.from && mailjetConfig.name) {
				this.mailjetLib = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name);
				this.mailjet = this.mailjetLib.mailjet;
			}
		}
	}

	find(params) {
		if (this.mailjet) {
			const resolution = params.CounterResolution ? params.CounterResolution : 'Lifetime';
			const lastweek = new Date()
			lastweek.setDate(new Date().getDate() - 7);
			var newParams = Object.assign({}, { FromTS: lastweek.toISOString(), Sort: 'Timeslice' }, params, { CounterResoltion: resolution });
			if (params.CounterResolution === 'Lifetime') {
				delete newParams.FromTS;
				delete newParams.ToTS;
			}
			var stats = this.mailjet.get('statcounters');
			return stats.request(newParams)
				.then((result) => {
					return result.body.Data;
				})
		} else {
			return { message: 'Error: @materia/mailjet config not found' };
		}
	}

	list() {
		if (this.mailjet) {
			var stats = this.mailjet.get('statcounters');
			return stats.request({ CounterSource: "APIKey", CounterResolution: "Lifetime", CounterTiming: "Message" })
				.then((result) => {
					return result.body.Data;
				})
		} else {
			return { message: 'Error: @materia/mailjet config not found' };
		}
	}
}

module.exports = MailjetStatistic;