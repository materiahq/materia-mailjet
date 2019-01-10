const MailjetSender = require('../../lib/mailjet')

class MailjetContact {
	constructor(app, entity) {
		this.app = app;
		this.entity = entity;
		if (app.addons && app.addonsConfig) {
			const mailjetConfig = app.addons.addonsConfig['@materia/mailjet'];
			if (mailjetConfig && mailjetConfig.apikey && mailjetConfig.secret && mailjetConfig.from && mailjetConfig.name) {
				this.mailjetLib = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name);
				this.mailjet = this.emailSender.mailjet;
			}
		}
	}

	list() {
		if (this.mailjet) {
			var contact = this.mailjet.get('contact');
			return contact.request()
				.then((result) => {
					return result.body.Data;
				});
		} else {
			return { message: 'Error: @materia/mailjet config not found' };
		}
	}

	get(params) {
		if (this.mailjet) {
			var contact = this.mailjet.get(`contact/${params.EmailOrId}`);
			return contact.request()
				.then((result) => {
					return result.body.Data;
				});
		} else {
			return { message: 'Error: @materia/mailjet config not found' };
		}
	}

	create(params) {
		if (this.mailjet) {
			const createContact = this.mailjet.post('contact');
			return createContact.request(params)
				.then((result) => {
					return result.body.Data;
				});
		} else {
			return { message: 'Error: @materia/mailjet config not found' };
		}
	}

	update(params) {
		if (this.mailjet) {
			const updateContact = this.mailjet.put('contact');
			return updateContact.request(params)
				.then((result) => {
					return result.body.Data;
				});
		} else {
			return { message: 'Error: @materia/mailjet config not found' };
		}
	}
}

module.exports = MailjetContact;