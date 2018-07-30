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


	getMailjetTemplates() {
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

	getTemplates(params) {
		const mailjetDir = path.join(params.appPath, 'server', 'mailjet');
		const templateDir = path.join(params.appPath, 'server', 'mailjet', 'templates');
		let p = Promise.resolve();
		p = p.then(() => this._checkDirectory(mailjetDir))
		p = p.then(() => this._checkDirectory(templateDir))
		p = p.then(() => this._listFiles(templateDir))
		return p.then(files => files)
			.catch(() => {
				return []
			})
	}

	saveTemplate(params) {
		return this._saveFile(params.name, params.content, params.appPath)
	}

	_saveFile(filename, content, appPath) {
		return new Promise((resolve, reject) => {
			const p = path.join(appPath, 'server', 'mailjet', 'templates', filename);
			if (filename.indexOf('.html') === -1) {
				p = `${p}.html`
			}
			fs.writeFile(p, content, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve();
			})
		})
	}

	_listFiles(directory) {
		return new Promise((resolve, reject) => {
			const formatedFiles = [];
			let p = Promise.resolve();

			fs.readdir(directory, (err, files) => {
				if (err) {
					reject(err);
				}
				if (files && files.length) {
					files.forEach((file, index) => {
						p = p.then(() => this._loadTemplateCode(directory, file, index).then((res) => {
							formatedFiles.push({
								name: files[res.index],
								code: res.code
							});
						}));
					});
					p.then(() => resolve(formatedFiles));
				} else {
					resolve([]);
				}
			})
		})
	}

	_createDirectory(p) {
		return fs.mkdir(p, (err) => {
			if (err) {
				return Promise.reject(err);
			}
			return Promise.resolve();
		});
	}

	_checkDirectory(directory) {
		return fs.stat(directory, (err, stats) => {
			// Check if error defined and the error code is "not exists"
			if (err && err.code === 'ENOENT') {
				return this._createDirectory(directory);
			}
			return Promise.resolve();
		});
	}

	_loadTemplateCode(directory, filename, index) {
		return new Promise((resolve, reject) => {
			fs.readFile(
				path.join(directory, filename),
				'utf-8',
				(err, data) => {
					let code;
					if (err) {
						code = '';
					}
					if (data) {
						code = data.toString();
					}
					resolve({
						code: code,
						index: index
					});
				});
		})
	}
}

module.exports = MailjetSender
