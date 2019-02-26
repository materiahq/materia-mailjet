import { App } from '@materia/server';

import { MailjetSender } from '../../lib/mailjet';

class MailjetContact {
  mailjetLib: MailjetSender;

  constructor(private app: App) {
    this.mailjetLib = new MailjetSender(this.app);
  }

  list(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const contact = this.mailjetLib.mailjet.get('contact');
      return contact.request(params).then(result => {
        return result.body.Data;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  get(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const contact = this.mailjetLib.mailjet.get(`contact/${params.EmailOrId}`);
      return contact.request().then(result => {
        return result.body.Data;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  create(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const createContact = this.mailjetLib.mailjet.post('contact');
      return createContact.request(params).then(result => {
        return result.body.Data;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  update(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const updateContact = this.mailjetLib.mailjet.put('contact');
      return updateContact.request(params).then(result => {
        return result.body.Data;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }
}

module.exports = MailjetContact;
