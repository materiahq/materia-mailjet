const MailjetSender = require('../../lib/mailjet')

class MailjetMessage {
  constructor(app, entity) {
    this.app = app;
    this.entity = entity;
    this.mailjetLib = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name);
    this.mailjet = this.mailjetLib.mailjet;
  }

  list(params) {
    var message = this.mailjet.get('message');
    if (!params.FromTS) {
      const lastweek = new Date()
      lastweek.setDate(new Date().getDate() - 7);
      params.FromTS = lastweek.toISOString();
    }
    if (!params.ToTS) {
      const now = new Date()
      params.ToTS = now.toISOString()
    }
    var newParams = Object.assign({}, {
      ShowSubject: true,
      ShowContactAlt: true,
      Sort: 'ArrivedAt'
    }, params);
    return message.request(newParams)
      .then((result) => {
        return result.body.Data;
      }).catch(err => err)
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

    return sendEmail.request(emailData)
      .then((result) => {
        return result.body.Data;
      }).catch(err => err)
  }

  sendTemplateById(params) {
    const sendTemplate = this.mailjet
      .post("send", {
        'version': 'v3.1'
      })

    var emailData = {
      'FromEmail': this.from,
      'Subject': params.subject,
      'Recipients': [{
        'Email': params.to,
        'Name': params.to
      }],
      'Mj-TemplateID': params.templateId,
      'Mj-TemplateLanguage': 'true',
      'Vars': {}
    }

    if (this.name) {
      emailData['FromName'] = this.name;
    }
    return sendTemplate.request(emailData)
      .then((result) => {
        return result.body;
      }).catch(err => err)
    /*return this.getTemplateContent({ID: params.templateId}).then(result => {
			delete params.templateId;
			const content = result.body.Data[0];
			emailData['Html-part'] = content['Html-part'];
            return sendEmail.request(emailData)
            .then((result) => {
                return result.body.Data;
            }).catch(err => err)
		 });*/
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
    return this.getTemplateContent({
      ID: params.templateId
    }).then(result => {
        console.log('Template content : ', result['Html-part']);
      const html = result['Html-part'];
      emailData['Html-part'] = html;
      return sendEmail.request(emailData)
    }).then((result) => result.body).catch(err => err);
  }

  getTemplateContent(params) {
    const getContent = this.mailjet.get(`template/${params.ID}/detailcontent`);
    return getContent.request()
      .then((result) => result.body.Data[0]).catch(err => err);
  }

  sendTemplateV3(params) {
    const sendTemplate = this.mailjet.post('send', {
      'version': 'v3.1'
    })

    var emailData = {
      'From': {
        'Email': this.from,
        'Name': this.name
      },
      'To': [{
        'Email': params.to,
        'Name': params.to
      }],
      'Subject': params.subject,
      'TemplateID': params.templateId,
      'TemplateLanguage': true,
      'Variables': {}
    }

    if (this.name) {
      emailData['FromName'] = this.name;
    }
    return sendTemplate.request({
        'Messages': [
          emailData
        ]
      })
      .then((result) => {
        console.log('Send template result : ', result.body);
        return result.body;
      }).catch(err => {
        console.log('Send template error :', err);
        return err
      })
    /*return this.getTemplateContent({ID: params.templateId}).then(result => {
			delete params.templateId;
			const content = result.body.Data[0];
			emailData['Html-part'] = content['Html-part'];
            return sendEmail.request(emailData)
            .then((result) => {
                return result.body.Data;
            }).catch(err => err)
		 });*/
  }
}

module.exports = MailjetMessage;
