const MailjetSender = require('../../lib/mailjet');

class MailjetTemplate {
  constructor(app, entity) {
    this.app = app;
    this.entity = entity;
    if (this.app.addons && this.app.addons.addonsConfig) {
      const mailjetConfig = this.app.addons.addonsConfig['@materia/mailjet'];
      if (mailjetConfig && mailjetConfig.apikey && mailjetConfig.secret && mailjetConfig.from && mailjetConfig.name) {
        this.mailjetLib = new MailjetSender(app.addons.addonsConfig['@materia/mailjet'].apikey, app.addons.addonsConfig['@materia/mailjet'].secret, app.addons.addonsConfig['@materia/mailjet'].from, app.addons.addonsConfig['@materia/mailjet'].name);
        this.mailjet = this.mailjetLib.mailjet;
      }
    }
  }

  list(params) {
    if (this.mailjet) {
      if (params.OwnerId) {
        params.User = params.OwnerId;
        delete params.OwnerId;
      }
      var templates = this.mailjet.get('template');
      return templates.request(params)
        .then((result) => result.body.Data);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  create(params) {
    if (this.mailjet) {
      if (params.Purposes) {
        params.Purposes = params.Purposes.split(',');
      }
      const createTemplate = this.mailjet.post('template');
      return createTemplate.request(params)
        .then((result) => result.body.Data);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  delete(params) {
    if (this.mailjet) {
      const deleteTemplate = this.mailjet.delete(`template/${params.ID}`);
      return deleteTemplate.request()
        .then(() => true);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  updateContent(params) {
    if (this.mailjet) {
      const updateContent = this.mailjet.post(`template/${params.ID}/detailcontent`);
      delete params.ID;
      return updateContent.request(params)
        .then((result) => result.body.Data);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  getContent(params) {
    if (this.mailjet) {
      const getContent = this.mailjet.get(`template/${params.ID}/detailcontent`);
      return getContent.request()
        .then((result) => result.body.Data);
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }
}

module.exports = MailjetTemplate;
