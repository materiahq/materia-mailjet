import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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

  get templateVariablesControl(): FormArray {
    return (this.sendForm.get('variables') as FormArray);
  }

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SendModalComponent>) { }

  ngOnInit() {
    this.refreshForm();
  }

  addTemplateVariable() {
    this.templateVariablesControl.push(
      this.fb.group({
        name: [null, Validators.required],
        value: [null, Validators.required]
      })
    );
  }

  removeTemplateVariable(index) {
    this.templateVariablesControl.removeAt(index);
  }

  refreshForm(type?) {
    if (type) {
      this.type = type;
    }
    if (this.type === 'simple') {
      this.sendForm = this.fb.group({
        to: [this.to ? this.to : '', Validators.required],
        subject: [this.subject ? this.subject : '', Validators.required],
        body: [''],
        variables: this.fb.array([])
      });
    } else {
      if (! this.templateId) {
        this.templateId = this.templates && this.templates.length ? this.templates[0].ID : '';
      }
      this.sendForm = this.fb.group({
        to: [this.to ? this.to : '', Validators.required],
        subject: [this.subject ? this.subject : '', Validators.required],
        template: [this.templateId, Validators.required],
        variables: this.fb.array([])
      });
    }
  }

  send() {
    if (this.sendForm.valid) {
      const data = Object.assign({}, {type: this.type}, this.sendForm.value);
      this.dialogRef.close(data);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
