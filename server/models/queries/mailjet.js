const MailjetSender = require('../../lib/mailjet')

class MailjetModel {
	constructor(app, entity) {
		this.app = app;
		this.entity = entity;
		this.emailSender = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name)
	}

	send(params) {
		return this.emailSender.send(params).then((result) => {
			return result.body;
		})
	}

	sendTemplate(params) {
		console.log('sendTemplate: ' + JSON.stringify(params));
		return this.emailSender.sendTemplate(params).then((result) => {
			return result.body;
		})
	}

	sendTemplateById(params) {
		return this.emailSender.sendTemplateById(params).then((result) => {
			console.log('Result : ', result.body);
			return result.body;
		}).catch(err => {
			console.log('Error :', err);
			return err;
		})
	}
}

module.exports = MailjetModel;