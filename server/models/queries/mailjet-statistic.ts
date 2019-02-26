import { App } from '@materia/server';

import { MailjetSender } from '../../lib/mailjet';

class MailjetStatistic {
  mailjetLib: MailjetSender;

  constructor(private app: App) {
    this.mailjetLib = new MailjetSender(this.app);
  }

  find(params) {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const resolution = params.CounterResolution
        ? params.CounterResolution
        : 'Lifetime';
      const lastweek = new Date();
      lastweek.setDate(new Date().getDate() - 7);
      const newParams = Object.assign(
        {},
        { FromTS: lastweek.toISOString(), Sort: 'Timeslice' },
        params,
        { CounterResoltion: resolution }
      );
      if (params.CounterResolution === 'Lifetime') {
        delete newParams.FromTS;
        delete newParams.ToTS;
      }
      const stats = this.mailjetLib.mailjet.get('statcounters');
      return stats.request(newParams).then(result => {
        return result.body.Data;
      });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }

  list() {
    this.mailjetLib.reload();
    if (this.mailjetLib.mailjet) {
      const stats = this.mailjetLib.mailjet.get('statcounters');
      return stats
        .request({
          CounterSource: 'APIKey',
          CounterResolution: 'Lifetime',
          CounterTiming: 'Message'
        })
        .then(result => {
          return result.body.Data;
        });
    } else {
      return Promise.reject(new Error('Addon @materia/mailjet not configured'));
    }
  }
}

module.exports = MailjetStatistic;
