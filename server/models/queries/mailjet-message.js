const MailjetSender = require('../../lib/mailjet')

class MailjetMessage {

	constructor(app, entity) {
		this.app = app;
		this.entity = entity;
		this.emailSender = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name)
		this.mailjet = this.emailSender.mailjet;
	}

	list(params) {
		var message = this.mailjet.get('message');
		if ( ! params.FromTS ) {
		  const lastweek = new Date();
		  lastweek.setDate(new Date().getDate() - 7);
		  params.FromTS = lastweek.toISOString();
		}
		if ( ! params.ToTS ) {
		  const now = new Date();
		  params.ToTS = now.toISOString();
		}
		var newParams = Object.assign({}, {
		  ShowSubject: true,
		  ShowContactAlt: true,
		  Sort: 'ArrivedAt'
		}, params);
		return message.request(newParams)
		  .then((result) => {
			return result.body.Data;
		});
	}

	send(params) {
		return this.emailSender.send(params).then((result) => {
			return result.body;
		})
	}

	sendTemplate(params) {
		return this.emailSender.sendTemplate(params).then((result) => {
			return result.body;
		});
	}
}

module.exports = MailjetMessage;