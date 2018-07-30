import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mailjet-header',
  templateUrl: './mailjet-header.component.html',
  styleUrls: ['./mailjet-header.component.scss']
})
export class MailjetHeaderComponent implements OnInit {
  @Input() settings: any;
  @Output() settingsOpened = new EventEmitter();
  @Output() sendDialogOpened = new EventEmitter();
  @Output() timelineChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}
