
import { App } from '@materia/server';
import axios from 'axios';
import { MailjetService } from '../../lib/mailjet';

class MailjetTemplate {
  mailjetLib: MailjetService;

  constructor(private app: App) {
    this.mailjetLib = new MailjetService(this.app);
  }

  async list(params) {
    this.mailjetLib.checkApi();
    // Use directly api REST because of issue with node mailjet on this endpoint
    // const templatesEndpoint = this.mailjetLib.api.get('template', {'version': 'v3'});
    const buffer = new Buffer(`${MailjetService.apikey}:${MailjetService.secret}`);
    const { data: { Data } } = await axios.get('https://api.mailjet.com/v3/REST/template', { headers: {
      Authorization: `Basic ${buffer.toString('base64')}`
    }})
    return Data;
  }

  create(params) {
    this.mailjetLib.checkApi();
    if (params.Purposes) {
      params.Purposes = params.Purposes.split(',');
    }
    const createTemplateEndpoint = this.mailjetLib.api.post('template');
    return createTemplateEndpoint.request(params).then(({ body: { Data } }) => Data);
  }

  delete(params) {
    this.mailjetLib.checkApi();
    const deleteTemplateRequest = this.mailjetLib.api.delete(`template/${params.ID}`).request();
    return deleteTemplateRequest.then(() => true);
  }

  updateContent(params) {
    this.mailjetLib.checkApi();
    const updateContentEndpoint = this.mailjetLib.api.post(
      `template/${params.ID}/detailcontent`
    );
    delete params.ID;
    return updateContentEndpoint.request(params).then(({ body: { Data } }) => Data);
  }

  getContent(params) {
    this.mailjetLib.checkApi();
    const getContentRequest = this.mailjetLib.api.get(
      `template/${params.ID}/detailcontent`
    ).request();
    return getContentRequest.then(({ body: { Data } }) => Data);
  }
}

module.exports = MailjetTemplate;
