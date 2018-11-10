import { Component, Input, OnChanges } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'mailjet-statistic',
  templateUrl: './mailjet-statistic.component.html',
  styleUrls: ['./mailjet-statistic.component.scss']
})
export class MailjetStatisticComponent implements OnChanges {
  @Input() data: {name: string, data: number[], type: string, color: string}[];
  @Input() loading: boolean;
  @Input() expanded: boolean;
  @Input() xAbsis: string[];

  counts: any = {
    sent: 0,
    opened: 0,
    clicked: 0,
    spam: 0,
    bounced: 0,
    blocked: 0
  };
  legend: string[];
  chartOptions: EChartOption;

  constructor( ) { }

  ngOnChanges(changes) {
    if (changes && this.data) {
      const data = this.data;
      data.forEach(d => {
        if (d.data && d.data.length) {
          let count = this.counts[d.name.toLowerCase()] = 0;
          d.data.forEach(value => {
            count = count + value;
          });
          this.counts[d.name.toLowerCase()] = count;
        }
      });
      this.legend = this.data.map(d => d.name);
      this.chartOptions = Object.assign({}, {
        legend: {
          top: 'top',
          left: 'center',
          data: this.legend
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '1%',
          containLabel: true
      },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          boundaryGap: false,
          type: 'category',
          data: this.xAbsis
        },
        yAxis: {
          type: 'value'
        },
        series: this.data
      });
    }
  }
}
