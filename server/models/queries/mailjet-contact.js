const MailjetSender = require('../../lib/mailjet')

class MailjetContact {
	constructor(app, entity) {
		this.app = app;
		this.entity = entity;
        this.mailjetLib = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name);
        this.mailjet = this.mailjetLib.mailjet;
	}

	list() {
		var contact = this.mailjet.get('contact');
		return contact.request()
        .then((result) => {
			return result.body.Data;
		}).catch(err => err)
	}
}

module.exports = MailjetContact;