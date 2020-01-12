import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Addon } from '@materia/addons';

import { MailjetViewComponent, MailjetStatisticComponent, StatsCounterComponent, MailjetHeaderComponent} from './components';
import { TemplateEditorComponent, SendModalComponent } from './dialogs';
import { SafeTemplatePipe } from './pipes/safe-template.pipe';
import { MailjetTemplateModule } from './modules/mailjet-template/mailjet-template.module';
import { UiModule } from './modules/ui-module/ui-module.module';
import { MailjetContactModule } from './modules/mailjet-contact/mailjet-contact.module';
import { MailjetEmailModule } from './modules/mailjet-email/mailjet-email.module';

@Addon('@materia/mailjet')
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MailjetTemplateModule,
    MailjetContactModule,
    MailjetEmailModule,
    UiModule
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
