import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'safeTemplate' })
export class SafeTemplatePipe implements PipeTransform {

  constructor(private sanitized: DomSanitizer) { }

  transform(value) {
    const newVal = this.sanitized.bypassSecurityTrustHtml(value);
    return newVal;
  }
}
