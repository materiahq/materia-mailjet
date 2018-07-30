const MailjetSender = require('../../lib/mailjet')

class MailjetModel {
	constructor(app, entity) {
		this.app = app;
		this.entity = entity;
		this.emailSender = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name)
	}

	send(params) {
		return this.emailSender.send(params);
	}

	sendTemplate(params) {
		return this.emailSender.sendTemplate(params).then(() => {
			params.from = this.app.addons.addonsConfig['@materia/mailjet'].from
			params.date_sent = new Date()
			return this.entity.getQuery('create')
				.run(params)
		})
	}

	getTemplates() {
		return this.emailSender.getTemplates({appPath: this.app.path});
	}

	saveTemplate(params) {
		return this.emailSender.saveTemplate(Object.assign({}, params, {appPath: this.app.path}));
	}

	getUserDetails() {
		return this.emailSender.getUserDetails().then((result) => {
			return result.body.Data;
		}).catch(err => {
			console.log(err);
			return err;
		})
	}
	getStats(params) {
		return this.emailSender.getStats(params).then((result) => {
			return result.body.Data;
		}).catch(err => {
			console.log(err);
			return err;
		})
	}
	getAPIKeyStats() {
		return this.emailSender.getAPIKeyStats().then((result) => result.body.Data).catch(err => err);
	}
	getMailjetTemplates() {
		return this.emailSender.getMailjetTemplates().then((result) => result.body.Data).catch(err => err);
	}
	getMessages(params) {
		return this.emailSender.getMessages(params).then((result) => result.body.Data).catch(err => err);
	}
	getCampaigns() {
		return this.emailSender.getCampaigns().then((result) => result.body.Data).catch(err => err);
	}
	getContacts() {
		return this.emailSender.getContacts().then((result) => {
			return result.body.Data;
		}).catch(err => {
			console.log(err);
			return err;
		})
	}
}

module.exports = MailjetModel;