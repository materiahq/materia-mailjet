import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'mailjet-statistic',
  templateUrl: './mailjet-statistic.component.html',
  styleUrls: ['./mailjet-statistic.component.scss']
})
export class MailjetStatisticComponent implements OnChanges {
  @Input() data: any;
  loading: boolean;

  counts: any =  {
    sent: 0,
    opened: 0,
    clicked: 0,
    spam: 0
  };

  constructor() {
    this.loading = true;
  }

  ngOnChanges(changes) {
    if (changes && changes.data && changes.data.currentValue) {
      const data = changes.data.currentValue;
      data.forEach(d => {
        if (d.series && d.series.length) {
          this.loading = false;
          let count = this.counts[d.name.toLowerCase()] = 0;
          d.series.forEach(s => {
            count = count + s.value;
          });
          this.counts[d.name.toLowerCase()] = count;
        } else {
          this.loading = true;
        }
      });
    }
  }
}
