import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailjetTemplateListComponent } from './components/mailjet-template-list/mailjet-template-list.component';
import { UiModule } from '../ui-module/ui-module.module';



@NgModule({
  imports: [
    CommonModule,
    UiModule
  ],
  declarations: [MailjetTemplateListComponent],
  exports: [MailjetTemplateListComponent],
  providers: []
})
export class MailjetTemplateModule { }
