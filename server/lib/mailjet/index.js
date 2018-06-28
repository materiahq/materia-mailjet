const path = require('path');
const fs = require('fs');

class MailjetSender {
	constructor(key, secret, from, name) {
		this.from = from
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
			emailData['FromName'] = this.name
		}

		return sendEmail.request(emailData)
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
		return new Promise((resolve, reject) => {
			const p = path.join(params.appPath, 'server', 'mailjet', 'templates');
			this._checkDirectory(p)
				.then(() =>
					this._listFiles(p)
				)
				.then(files => resolve(files))
				.catch(() => resolve([]))
		});
	}

	saveTemplate(params) {
		const p = path.join(params.appPath, 'server', 'mailjet', 'templates');
		return this._checkDirectory(p)
			.then(() => {
				return this._saveFile(params.name, params.content, params.appPath);
			}).catch(() => {
				return this._createDirectory(p).then(() => {
					return this._saveFile(params.name, params.content, params.appPath)
				})
			})
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
				} else {
					resolve();
				}
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
		return new Promise((resolve, reject) => {
			fs.mkdir(p, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			})
		})
	}

	_checkDirectory(directory) {
		return new Promise((resolve, reject) => {
			fs.stat(directory, (err, stats) => {
				// Check if error defined and the error code is "not exists"
				if (err && err.errno === 34) {
					reject(err)
				}
				resolve();
			});
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
