import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
  Input,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'mailjet-send-modal',
  templateUrl: './send-modal.component.html',
  styleUrls: ['./send-modal.component.scss']
})
export class SendModalComponent implements OnInit {
  sendForm: FormGroup;
  @Input() to: string;
  @Input() templateId: number;
  @Input() templates: any;
  @Input() subject: string;
  @Input() type = 'simple';

  @Output() confirmed = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  @ViewChild('sendDialog') template: TemplateRef<any>;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.refreshForm();
  }

  refreshForm(type?) {
    if (type) {
      this.type = type;
    }
    if (this.type === 'simple') {
      this.sendForm = this.fb.group({
        to: [this.to ? this.to : '', Validators.required],
        subject: [this.subject ? this.subject : '', Validators.required],
        body: ['']
      });
    } else {
      if (! this.templateId) {
        this.templateId = this.templates && this.templates.length ? this.templates[0].ID : '';
      }
      this.sendForm = this.fb.group({
        to: [this.to ? this.to : '', Validators.required],
        subject: [this.subject ? this.subject : '', Validators.required],
        template: [this.templateId, Validators.required]
      });
    }
  }

  send() {
    const data = Object.assign({}, {type: this.type}, this.sendForm.value);
    this.confirmed.emit(data);
  }
}
