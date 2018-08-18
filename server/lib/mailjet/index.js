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
    const sendEmail = this.mailjet.post('send');

    const emailData = {
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
	const recipient = {'Email': params.to};
	if (params.variables) {
		recipient.Vars = JSON.parse(params.variables);
	}
	const sendTemplateById = this.mailjet.post('send')
	const emailData = {
        'FromEmail': params.fromEmail ? params.fromEmail : this.from,
        'FromName': params.from ? params.from : this.name,
        'Subject': params.subject,
        'Mj-TemplateID': params.templateId,
        'Mj-TemplateLanguage': 'true',
        'Recipients': [recipient]
      };
      return sendTemplateById.request(emailData);
  }

  // Same as sendTemplate() but uses Mailjet API v3.1
  sendTemplateByIdV31(params) {
    const sendTemplateById = this.mailjet
      .post('send', {
        'version': 'v3.1'
	  })
	  const emailData = {
        'Messages': [{
          'From': {
            'Email': params.fromEmail ? params.fromEmail : this.from,
            'Name': params.from ? params.from : this.name
          },
          'To': [{
            'Email': params.to
          }],
          'TemplateID': params.templateId,
          'TemplateLanguage': true,
          'Subject': params.subject,
          'Variables': params.variables ? JSON.parse(params.variables) :{}
        }]
      };
      return sendTemplateById.request(emailData);
  }
}

module.exports = MailjetSender
