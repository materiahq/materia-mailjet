import { MailjetSender } from '../../lib/mailjet';
import { App, Entity } from '@materia/server';

class MailjetStatistic {
	mailjetLib: MailjetSender;
	mailjet: any;

	constructor(private app: App, private entity: Entity) {
		if (this.app.addons && this.app.addons.addonsConfig) {
			const mailjetConfig = this.app.addons.addonsConfig['@materia/mailjet'];
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
			return Promise.reject(new Error('Addon @materia/mailjet not configured'));
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
			return Promise.reject(new Error('Addon @materia/mailjet not configured'));
		}
	}
}

module.exports = MailjetStatistic;