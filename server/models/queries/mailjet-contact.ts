import { MailjetSender } from '../../lib/mailjet';
import { App, Entity } from '@materia/server';

class MailjetContact {
  mailjetLib: MailjetSender;
  mailjet: any;

  constructor(private app: App, private entity: Entity) {
    if (this.app.addons && this.app.addons.addonsConfig) {
      const mailjetConfig = this.app.addons.addonsConfig['@materia/mailjet'];
      if (
        mailjetConfig &&
        mailjetConfig.apikey &&
        mailjetConfig.secret &&
        mailjetConfig.from &&
        mailjetConfig.name
      ) {
        this.mailjetLib = new MailjetSender(
          app.addons.addonsConfig['@materia/mailjet'].apikey,
          app.addons.addonsConfig['@materia/mailjet'].secret,
          app.addons.addonsConfig['@materia/mailjet'].from,
          app.addons.addonsConfig['@materia/mailjet'].name
        );
        this.mailjet = this.mailjetLib.mailjet;
      }
    }
  }

  list() {
    if (this.mailjet) {
      const contact = this.mailjet.get('contact');
      return contact.request().then(result => {
        return result.body.Data;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  get(params) {
    if (this.mailjet) {
      const contact = this.mailjet.get(`contact/${params.EmailOrId}`);
      return contact.request().then(result => {
        return result.body.Data;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  create(params) {
    if (this.mailjet) {
      const createContact = this.mailjet.post('contact');
      return createContact.request(params).then(result => {
        return result.body.Data;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  update(params) {
    if (this.mailjet) {
      const updateContact = this.mailjet.put('contact');
      return updateContact.request(params).then(result => {
        return result.body.Data;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }
}

module.exports = MailjetContact;
