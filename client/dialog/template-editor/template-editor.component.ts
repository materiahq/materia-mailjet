import { Component, OnInit, Input, Output, ViewChild, TemplateRef, EventEmitter} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


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

  @Output() cancelled = new EventEmitter();
  @Output() confirmed = new EventEmitter();

  @ViewChild('templateDialog') template: TemplateRef<any>;

  constructor(private fb: FormBuilder) { }

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
    this.confirmed.emit(this.templateForm.value);
  }

  cancel() {
    this.cancelled.emit();
  }

}
