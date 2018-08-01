const path = require('path');
const fs = require('fs');

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
			console.log('Template content : ', content);
			emailData['Html-part'] = content['Html-part'];
			return sendEmail.request(emailData);
		 });
	}

	getUserDetails() {
		var user = this.mailjet.get('user');
		return user.request();
	}

	getStats(params) {
		const resolution = params.CounterResolution ? params.CounterResolution : 'Lifetime';
		const lastweek = new Date()
		lastweek.setDate(new Date().getDate() - 7);
		var newParams = Object.assign({}, {FromTS: lastweek.toISOString()}, params, {CounterResoltion: resolution});
		if (params.CounterResolution === 'Lifetime') {
			delete newParams.FromTS;
			delete newParams.ToTS;
		}
		var stats = this.mailjet.get('statcounters');
		return stats.request(newParams); // ToTS: new Date("2018-06-05").toISOString()}
	}

	getAPIKeyStats() {
		var stats = this.mailjet.get('statcounters');
		return stats.request({CounterSource: "APIKey", CounterResolution: "Lifetime", CounterTiming: "Message"});
	}

	getContacts() {
		var contact = this.mailjet.get('contact');
		return contact.request();
	}

	getMessages(params) {
		var message = this.mailjet.get('message');
		const lastweek = new Date()
		lastweek.setDate(new Date().getDate() - 7);
		var newParams = Object.assign({}, {ShowSubject: true, ShowContactAlt: true, FromTS: lastweek.toISOString(), Sort: 'ArrivedAt'}, params);
		return message.request(newParams);
	}

	getCampaigns() {
		var campaign = this.mailjet.get('campaign');
		return campaign.request();
	}


	getTemplates(params) {
		var templates = this.mailjet.get('template');
		return templates.request(params);
	}

	createTemplate(params) {
		if (params.Purposes) {
			params.Purposes = params.Purposes.split(',');
		}
		const createTemplate = this.mailjet.post('template');
		return createTemplate.request(params);
	}

	updateTemplateContent(params) {
		const updateTemplateContent = this.mailjet.post(`template/${params.ID}/detailcontent`);
		delete params.ID;
		return updateTemplateContent.request(params);
	}

	getTemplateContent(params) {
		const getTemplateContent = this.mailjet.get(`template/${params.ID}/detailcontent`);
		return getTemplateContent.request();
	}

	deleteTemplate(params) {
		const deleteTemplate = this.mailjet.delete(`template/${params.ID}`);
		return deleteTemplate.request();
	}
}

module.exports = MailjetSender
