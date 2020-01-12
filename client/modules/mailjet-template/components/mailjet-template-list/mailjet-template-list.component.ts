import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mailjet-template-list',
  templateUrl: './mailjet-template-list.component.html',
  styleUrls: ['./mailjet-template-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailjetTemplateListComponent {
  @Input() templates: any[];
  @Input() expanded: boolean;
  @Output() openSendDialog = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() new = new EventEmitter();
}
