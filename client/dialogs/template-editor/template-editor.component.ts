import { Component, OnInit, Input, Output, ViewChild, TemplateRef, EventEmitter} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'mailjet-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements OnInit {
  templateForm: FormGroup;
  @Input() edition;
  @Input() settings;
  @Input() user;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<TemplateEditorComponent>) { }

  ngOnInit() {
    this.refreshTemplateForm();
  }

  refreshTemplateForm() {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      author: [this.user ? this.user.Username : '', Validators.required],
      templateType: ['transactional', Validators.required]
    });
  }

  confirm() {
    this.dialogRef.close(this.templateForm.value);
  }

  cancel() {
    this.dialogRef.close();
  }

}
