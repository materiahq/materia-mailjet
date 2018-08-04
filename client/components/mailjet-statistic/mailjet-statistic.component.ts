import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { LineChartComponent } from '@swimlane/ngx-charts';

@Component({
  selector: 'mailjet-statistic',
  templateUrl: './mailjet-statistic.component.html',
  styleUrls: ['./mailjet-statistic.component.scss']
})
export class MailjetStatisticComponent implements OnChanges {
  @Input() data: any;
  @Input() loading: boolean;
  @Input() expanded: boolean;

  @ViewChild(LineChartComponent) chart: LineChartComponent;

  counts: any = {
    sent: 0,
    opened: 0,
    clicked: 0,
    spam: 0,
    bounced: 0
  };

  constructor() { }

  ngOnChanges(changes) {
    if (changes && changes.expanded && changes.expanded.currentValue && this.chart) {
      setTimeout(() => {
        this.chart.update();
      }, 500);
    }
    if (changes && changes.data && changes.data.currentValue) {
      const data = changes.data.currentValue;
      data.forEach(d => {
        if (d.series && d.series.length) {
          let count = this.counts[d.name.toLowerCase()] = 0;
          d.series.forEach(s => {
            count = count + s.value;
          });
          this.counts[d.name.toLowerCase()] = count;
        }
      });
    }
  }
}
