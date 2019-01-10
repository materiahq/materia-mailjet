class MailjetTemplate {
  constructor(app, entity) {
    this.app = app;
    this.entity = entity;
    this.config = app.addons.addonsConfig['@materia/mailjet'];
    if (this.config.apikey && this.config.secret) {
      this.connect(this.config);
    }
  }

  connect(config) {
    this.mailjet = require('node-mailjet').connect(config.apikey, config.secret);
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
      return { message: 'Error: @materia/mailjet config not found' };
    }
  }

  create(params) {
    if (params.Purposes) {
      params.Purposes = params.Purposes.split(',');
    }
    const createTemplate = this.mailjet.post('template');
    return createTemplate.request(params)
      .then((result) => result.body.Data);
  }

  delete(params) {
    const deleteTemplate = this.mailjet.delete(`template/${params.ID}`);
    return deleteTemplate.request()
      .then(() => true);
  }

  updateContent(params) {
    const updateContent = this.mailjet.post(`template/${params.ID}/detailcontent`);
    delete params.ID;
    return updateContent.request(params)
      .then((result) => result.body.Data);
  }

  getContent(params) {
    const getContent = this.mailjet.get(`template/${params.ID}/detailcontent`);
    return getContent.request()
      .then((result) => result.body.Data);
  }
}

module.exports = MailjetTemplate;
