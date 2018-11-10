import { Component, Input } from '@angular/core';

@Component({
  selector: 'mailjet-stats-counter',
  templateUrl: './stats-counter.component.html',
  styleUrls: ['./stats-counter.component.scss']
})
export class StatsCounterComponent {
  @Input() backgroundColor: string;
  @Input() color: string;
  @Input() count: number;
  @Input() label: string;
  @Input() width: number;
  @Input() height: number;

}
