import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

import {
  MatButtonModule,
  MatRippleModule,
  MatSnackBarModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatTabsModule,
  MatSelectModule,
  MatOptionModule,
  MatExpansionModule,
  MatDividerModule,
  MatListModule
} from '@angular/material';

export const UI_MODULES = [
  MonacoEditorModule,
  FlexLayoutModule,
  MatButtonModule,
  MatRippleModule,
  MatSnackBarModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatTabsModule,
  MatSelectModule,
  MatOptionModule,
  MatExpansionModule,
  MatDividerModule,
  MatListModule
];

import { Addon } from '@materia/addons';

import { MailjetViewComponent } from './mailjet-view/mailjet-view.component';
import { SafeTemplatePipe } from './safe-template.pipe';

@Addon('@materia/mailjet')
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ...UI_MODULES
  ],
  declarations: [MailjetViewComponent, SafeTemplatePipe],
  exports: [MailjetViewComponent, SafeTemplatePipe]
})
export class MailjetModule {}
