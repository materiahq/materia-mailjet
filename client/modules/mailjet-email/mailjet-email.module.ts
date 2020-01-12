import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailjetEmailSentComponent } from './mailjet-email-sent/mailjet-email-sent.component';
import { UiModule } from '../ui-module/ui-module.module';



@NgModule({
  declarations: [MailjetEmailSentComponent],
  imports: [
    CommonModule,
    UiModule
  ],
  exports: [MailjetEmailSentComponent]
})
export class MailjetEmailModule { }
