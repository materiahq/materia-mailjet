import { App } from '@materia/server';

import { MailjetService } from '../../lib/mailjet';

class MailjetStatistic {
  mailjetLib: MailjetService;

  constructor(private app: App) {
    this.mailjetLib = new MailjetService(this.app);
  }

  find(params) {
    this.mailjetLib.checkApi();
    const resolution = params.CounterResolution
      ? params.CounterResolution
      : 'Lifetime';
    const lastweek = new Date();
    lastweek.setDate(new Date().getDate() - 7);
    const newParams = Object.assign({},
      { FromTS: lastweek.toISOString(), Sort: 'Timeslice' },
      params,
      { CounterResoltion: resolution }
    );
    if (params.CounterResolution === 'Lifetime') {
      delete newParams.FromTS;
      delete newParams.ToTS;
    }
    return this.mailjetLib.api.get('statcounters')
      .request(newParams).then(({ body: { Data } }) => Data);
  }

  list() {
    this.mailjetLib.checkApi();
    return this.mailjetLib.api.get('statcounters').request({
      CounterSource: 'APIKey',
      CounterResolution: 'Lifetime',
      CounterTiming: 'Message'
    })
    .then(({ body: { Data } }) => Data);
  }
}

module.exports = MailjetStatistic;
