import { App } from '@materia/server';

export class MailjetService {
  static fromName: string;
  static from: string;
  static apikey: string;
  static secret: string;
  api;

  get settingsHasChanged(): boolean {
    const mailjetConfig = this.app.addons && this.app.addons.addonsConfig ? this.app.addons.addonsConfig['@materia/mailjet'] : {};
    const { apikey, secret, from, name } = mailjetConfig;
    return apikey !== MailjetService.apikey ||
      secret !== MailjetService.secret ||
      from !== MailjetService.from ||
      name !== MailjetService.fromName;
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
        this.connectApi(apikey, secret);
        MailjetService.from = from;
        MailjetService.fromName = name;
        MailjetService.apikey = apikey;
        MailjetService.secret = secret;
      }
    }
  }

  connectApi(key, secret): void {
    this.api = require('node-mailjet').connect(key, secret);
  }

  checkApi() {
    this.reload();
    if (! this.api) {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }
}
