import { App } from "@materia/server";

import { MailjetService } from "../../lib/mailjet";

class MailjetContact {
  mailjetLib: MailjetService;

  constructor(private app: App) {
    this.mailjetLib = new MailjetService(this.app);
  }

  list(params) {
    this.mailjetLib.checkApi();
    const contact = this.mailjetLib.api.get("contact");
    return contact.request(params).then(({ body: { Data }}) => Data);
  }

  get(params) {
    this.mailjetLib.checkApi();
    const contact = this.mailjetLib.api.get(
      `contact/${params.EmailOrId}`
    );
    return contact.request().then(({ body: { Data }}) => Data);
  }

  create(params) {
    this.mailjetLib.checkApi();
    const createContact = this.mailjetLib.api.post("contact");
    return createContact.request(params).then(({ body: { Data }}) => Data);
  }

  update(params) {
    this.mailjetLib.checkApi();
    const updateContact = this.mailjetLib.api.put("contact");
    return updateContact.request(params).then(({ body: { Data }}) => Data);
  }
}

module.exports = MailjetContact;
