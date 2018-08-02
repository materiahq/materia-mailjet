import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
  MatListModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatBadgeModule,
  MatToolbarModule
} from '@angular/material';

export const UI_MODULES = [
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
  MatListModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatBadgeModule,
  MatSelectModule,
  MatOptionModule,
  MatToolbarModule,

  FlexLayoutModule,

  NgxChartsModule,
  MonacoEditorModule
];

import { Addon } from '@materia/addons';

import { MailjetViewComponent } from './mailjet-view/mailjet-view.component';
import { SafeTemplatePipe } from './safe-template.pipe';
import { StatsCounterComponent } from './stats-counter/stats-counter.component';
import { MailjetStatisticComponent } from './mailjet-statistic/mailjet-statistic.component';
import { MailjetHeaderComponent } from './mailjet-header/mailjet-header.component';
import { TemplateEditorComponent } from './dialog/template-editor/template-editor.component';
import { SendModalComponent } from './dialog/send-modal/send-modal.component';

@Addon('@materia/mailjet')
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ...UI_MODULES
  ],
  declarations: [
    MailjetViewComponent,
    SafeTemplatePipe,
    StatsCounterComponent,
    MailjetStatisticComponent,
    MailjetHeaderComponent,
    TemplateEditorComponent,
    SendModalComponent
  ],
  exports: [MailjetViewComponent]
})
export class MailjetModule {}
