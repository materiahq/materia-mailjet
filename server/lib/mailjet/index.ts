import { App } from '@materia/server';

export class MailjetSender {
  static fromName: string;
  static from: string;
  static apikey: string;
  static secret: string;
  mailjet;

  get settingsHasChanged(): boolean {
    const mailjetConfig = this.app.addons && this.app.addons.addonsConfig ? this.app.addons.addonsConfig['@materia/mailjet'] : {};
    const { apikey, secret, from, name } = mailjetConfig;
    return apikey !== MailjetSender.apikey ||
      secret !== MailjetSender.secret ||
      from !== MailjetSender.from ||
      name !== MailjetSender.fromName;
  }

  constructor(private app: App) {
    this.init();
  }

  reload(): void {
    if (this.settingsHasChanged) {
      this.init();
    }
  }

  init(): void {
    if (this.app.addons && this.app.addons.addonsConfig) {
      const { apikey, secret, from, name } = this.app.addons.addonsConfig['@materia/mailjet'];
      if (apikey && secret && from && name) {
        this.connect(apikey, secret);
        MailjetSender.from = from;
        MailjetSender.fromName = name;
        MailjetSender.apikey = apikey;
        MailjetSender.secret = secret;
      }
    }
  }

  connect(key, secret): void {
    this.mailjet = require('node-mailjet').connect(key, secret);
  }

  send(params) {
    const sendEmail = this.mailjet.post('send');

    const emailData = {
      'FromEmail': MailjetSender.from,
      'Subject': params.subject,
      'Text-part': params.body,
      'Recipients': [{
        'Email': params.to
      }]
    };

    if (params.body_html) {
      emailData['Html-part'] = params.body_html;
    }

    if (MailjetSender.name) {
      emailData['FromName'] = MailjetSender.name;
    }

    return sendEmail.request(emailData);
  }

  sendTemplate(params) {
    const recipient: any = {'Email': params.to};
    if (params.variables) {
        const isString = typeof params.variables === 'string';
        recipient.Vars = isString ? JSON.parse(params.variables) : params.variables;
    }
    const sendTemplateById = this.mailjet.post('send');
    const emailData = {
        'FromEmail': params.fromEmail ? params.fromEmail : MailjetSender.from,
        'FromName': params.from ? params.from : MailjetSender.name,
        'Subject': params.subject,
        'Mj-TemplateID': params.templateId,
        'Mj-TemplateLanguage': 'true',
        'Recipients': [recipient]
    };
    return sendTemplateById.request(emailData);
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
            'Name': params.from ? params.from : MailjetSender.name
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
