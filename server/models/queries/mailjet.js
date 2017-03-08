const MailjetSender = require('../../lib/mailjet')

class MailjetModel {
	constructor(app, entity) {
		this.app = app;
		this.entity = entity;
		this.emailSender = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name)
	}

	send(params) {
		return this.emailSender.send(params).then(() => {
			params.from = this.app.addons.addonsConfig['@materia/mailjet'].from
			params.date_sent = new Date()
			return this.entity.getQuery('create')
				.run(params)
		})
	}
}

module.exports = MailjetModel;