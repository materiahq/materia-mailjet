import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailjetContactListComponent } from './mailjet-contact-list/mailjet-contact-list.component';
import { UiModule } from '../ui-module/ui-module.module';



@NgModule({
  declarations: [MailjetContactListComponent],
  imports: [
    CommonModule,
    UiModule
  ],
  exports: [MailjetContactListComponent]
})
export class MailjetContactModule { }
