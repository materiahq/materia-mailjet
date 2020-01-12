import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mailjet-contact-list',
  templateUrl: './mailjet-contact-list.component.html',
  styleUrls: ['./mailjet-contact-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailjetContactListComponent {
  @Input() contacts: any[];
  @Output() openSendToDialog = new EventEmitter();
}
