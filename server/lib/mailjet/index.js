class MailjetSender {
	constructor(key, secret, from, name) {
		if (key && secret && from && name) {
			this.connect(key, secret, from, name)
			this.from = from;
			this.name = name;
		}
	}

	connect(key, secret, from, name) {
		this.from = from;
		this.name = name;
		this.mailjet = require('node-mailjet').connect(key, secret);
	}

	send(params) {
		var sendEmail = this.mailjet.post('send');

		var emailData = {
			'FromEmail': this.from,
			'Subject': params.subject,
			'Text-part': params.body,
			'Recipients': [{
				'Email': params.to
			}]
		}

		if (this.name) {
			emailData['FromName'] = this.name;
		}

		return sendEmail.request(emailData);
	}

	sendTemplate(params) {
		var sendEmail = this.mailjet.post('send');

		var emailData = {
			'FromEmail': this.from,
			'Subject': params.subject,
			'Recipients': [{
				'Email': params.to
			}]
		}

		if (this.name) {
			emailData['FromName'] = this.name;
		}
		return this.getTemplateContent({ID: params.templateId}).then(result => {
			delete params.templateId;
			const content = result.body.Data[0];
			emailData['Html-part'] = content['Html-part'];
			return sendEmail.request(emailData);
		 });
	}

	getTemplateContent(params) {
		const getTemplateContent = this.mailjet.get(`template/${params.ID}/detailcontent`);
		return getTemplateContent.request();
	}
}

module.exports = MailjetSender
