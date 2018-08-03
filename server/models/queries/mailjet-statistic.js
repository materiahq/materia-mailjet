const MailjetSender = require('../../lib/mailjet')

class MailjetStatistic {
	constructor(app, entity) {
		this.app = app;
		this.entity = entity;
        this.mailjetLib = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name);
        this.mailjet = this.mailjetLib.mailjet;
	}

	find(params) {
		const resolution = params.CounterResolution ? params.CounterResolution : 'Lifetime';
		const lastweek = new Date()
		lastweek.setDate(new Date().getDate() - 7);
		var newParams = Object.assign({}, {FromTS: lastweek.toISOString(), Sort: 'Timeslice'}, params, {CounterResoltion: resolution});
		if (params.CounterResolution === 'Lifetime') {
			delete newParams.FromTS;
			delete newParams.ToTS;
		}
		var stats = this.mailjet.get('statcounters');
        return stats.request(newParams)
        .then((result) => {
			return result.body.Data;
		}).catch(err => err)
	}

	list() {
		var stats = this.mailjet.get('statcounters');
        return stats.request({CounterSource: "APIKey", CounterResolution: "Lifetime", CounterTiming: "Message"})
        .then((result) => {
			return result.body.Data;
		}).catch(err => err)
	}
}

module.exports = MailjetStatistic;