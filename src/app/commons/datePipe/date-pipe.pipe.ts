import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localDate',
  standalone: true,
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: Date | string | number): string | null {
    if (!value) return null;

    const currentLang = this.translate.currentLang || 'en';
    
    const format = currentLang === 'en' ? 'MM/dd/yyyy' : 'dd/MM/yyyy';
    
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, format);
  }
}