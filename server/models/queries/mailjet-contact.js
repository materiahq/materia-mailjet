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

	get(params) {
		var contact = this.mailjet.get(`contact/${params.EmailOrId}`);
		return contact.request()
        .then((result) => {
			return result.body.Data;
		}).catch(err => err)
	}

	create(params) {
		const createContact = this.mailjet.post('contact')
		return createContact.request(params)
		.then((result) => {
			return result.body.Data;
		}).catch(err => err)
	}

	update(params) {
		const updateContact = this.mailjet.put('contact')
		return updateContact.request(params)
		.then((result) => {
			return result.body.Data;
		}).catch(err => err)
	}
}

module.exports = MailjetContact;