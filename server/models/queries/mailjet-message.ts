import { App } from '@materia/server';

import { MailjetService } from '../../lib/mailjet';

class MailjetMessage {
  mailjetLib: MailjetService;

  constructor(private app: App) {
    this.mailjetLib = new MailjetService(this.app);
  }

  list(params) {
    this.mailjetLib.checkApi();
    const message = this.mailjetLib.api.get('message');
    if ( ! params || ! Object.keys(params).length) {
      const lastweek = new Date();
      lastweek.setDate(new Date().getDate() - 7);
      params.FromTS = lastweek.toISOString();
      const now = new Date();
      params.ToTS = now.toISOString();
    }
    const newParams = Object.assign({},
      {
        ShowSubject: true,
        ShowContactAlt: true,
        Sort: 'ArrivedAt'
      },
      params
    );
    return message.request(newParams).then(({ body: { Data }}) => Data);

  }

  send(params) {
    this.mailjetLib.checkApi();
    return this.sendRequest(params).then(({ body })=> body);
  }

  sendTemplate(params) {
    this.mailjetLib.checkApi();
    return this.sendTemplateRequest(params).then(({ body })=> body);
  }

  sendRequest(params) {
    const recipient: any = {'Email': params.to};
    const sendEmail = this.mailjetLib.api.post('send');
    if (params.variables) {
      const isString = typeof params.variables === 'string';
      recipient.Vars = isString ? JSON.parse(params.variables) : params.variables;
    }
    const emailData = {
      'FromEmail': MailjetService.from,
      'Subject': params.subject,
      'Text-part': params.body,
      'Recipients': [recipient],
      'Mj-TemplateLanguage': true
    };
    if (params.error_reporting) {
      emailData['Mj-TemplateErrorReporting'] = params.error_reporting_email ?? emailData['FromEmail'];
    }
    if (params.body_html) {
      emailData['Html-part'] = params.body_html;
    }

    if (MailjetService.fromName) {
      emailData['FromName'] = MailjetService.fromName;
    }

    return sendEmail.request(emailData);
  }

  sendTemplateRequest(params) {
    const { to, variables, fromEmail, from, subject, templateId, error_reporting, error_reporting_email } = params;
    const recipient: any = {'Email': to};
    if (variables) {
        const isString = typeof variables === 'string';
        recipient.Vars = isString ? JSON.parse(variables) : variables;
    }
    const sendTemplateByIdEndpoint = this.mailjetLib.api.post('send');
    const emailData = {
        'FromEmail': fromEmail ?? MailjetService.from,
        'FromName': from ?? MailjetService.fromName,
        'Subject': subject,
        'Recipients': [recipient],
        'Mj-TemplateID': templateId,
        'Mj-TemplateLanguage': true
    };
    if (error_reporting) {
      emailData['Mj-TemplateErrorReporting'] = error_reporting_email ?? emailData['FromEmail'];
    }
    return sendTemplateByIdEndpoint.request(emailData);
  }

  // Send template with Mailjet api v3.1
  /*
  sendTemplateByIdV31(params) {
    const sendTemplateById = this.mailjet
      .post('send', {
        'version': 'v3.1'
	  })
	  const emailData = {
        'Messages': [{
          'From': {
            'Email': params.fromEmail ? params.fromEmail : MailjetSender.from,
            'Name': params.from ? params.from : MailjetSender.fromName
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
  }*/
}

module.exports = MailjetMessage;
