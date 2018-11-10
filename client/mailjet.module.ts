import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxEchartsModule } from 'ngx-echarts';
import { Addon } from '@materia/addons';

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

import { MailjetViewComponent, MailjetStatisticComponent, StatsCounterComponent, MailjetHeaderComponent} from './components';
import { TemplateEditorComponent, SendModalComponent } from './dialogs';
import { SafeTemplatePipe } from './pipes/safe-template.pipe';

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
  NgxEchartsModule
];

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
