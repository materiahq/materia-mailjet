import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mailjet-email-sent',
  templateUrl: './mailjet-email-sent.component.html',
  styleUrls: ['./mailjet-email-sent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailjetEmailSentComponent {
  @Input() emails: any[];
  @Input() statusColors: any;
  @Output() openSendDialog = new EventEmitter<void>();
}
