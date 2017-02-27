const MailjetSender = require('../../lib/mailjet')

class EmailModel {
	constructor(app, entity) {
		this.app = app;
		this.entity = entity;
		this.emailSender = new MailjetSender(app.addons.addonsConfig['mailjet'].apikey, app.addons.addonsConfig['mailjet'].secret, app.addons.addonsConfig['mailjet'].from, app.addons.addonsConfig['mailjet'].name)
	}

	send(params) {
		return this.emailSender.send(params).then(() => {
			params.from = this.app.addons.addonsConfig['mailjet'].from
			params.date_sent = new Date()
			return this.entity.getQuery('create')
				.run(params)
		})
	}
}

module.exports = EmailModel;