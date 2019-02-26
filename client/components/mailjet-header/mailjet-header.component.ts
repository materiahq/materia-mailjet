import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mailjet-header',
  templateUrl: './mailjet-header.component.html',
  styleUrls: ['./mailjet-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailjetHeaderComponent {
  @Input() settings: any;
  @Input() error: boolean;
  @Output() settingsOpened = new EventEmitter();
  @Output() sendDialogOpened = new EventEmitter();
  @Output() timelineChanged = new EventEmitter<string>();

}
