const path = require('path');
const fs = require('fs');

class MailjetSender {
	constructor(key, secret, from, name) {
		if (key && secret && from && name) {
			this.connect(key, secret, from, name)
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
		var newParams = Object.assign({}, {ShowSubject: true, ShowContactAlt: true, FromTS: lastweek.toISOString()}, params);
		return message.request(newParams);
	}

	getCampaigns() {
		var campaign = this.mailjet.get('campaign');
		return campaign.request();
	}


	getTemplates() {
		var templates = this.mailjet.get('template');
		return templates.request();
	}

	sendTemplate(params) {
		var sendEmail = this.mailjet.post('send');

		var emailData = {
			'FromEmail': this.from,
			'Subject': params.subject,
			'Html-part': params.body,
			'Recipients': [{
				'Email': params.to
			}]
		}
		if (this.name) {
			emailData['FromName'] = this.name
		}

		return sendEmail.request(emailData)
	}
}

module.exports = MailjetSender
