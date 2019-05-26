import { App } from '@materia/server';

import { MailjetSender } from '../../lib/mailjet';

class MailjetTemplate {
  mailjetLib: MailjetSender;

  constructor(private app: App) {
    this.mailjetLib = new MailjetSender(this.app);
  }

  list(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const templates = this.mailjetLib.mailjet.get('template');
      return templates.request(params).then(result => result.body.Data);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  create(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      if (params.Purposes) {
        params.Purposes = params.Purposes.split(',');
      }
      const createTemplate = this.mailjetLib.mailjet.post('template');
      return createTemplate.request(params).then(result => result.body.Data);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  delete(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const deleteTemplate = this.mailjetLib.mailjet.delete(`template/${params.ID}`);
      return deleteTemplate.request().then(() => true);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  updateContent(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const updateContent = this.mailjetLib.mailjet.post(
        `template/${params.ID}/detailcontent`
      );
      delete params.ID;
      return updateContent.request(params).then(result => result.body.Data);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  getContent(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const getContent = this.mailjetLib.mailjet.get(
        `template/${params.ID}/detailcontent`
      );
      return getContent.request().then(result => result.body.Data);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }
}

module.exports = MailjetTemplate;
