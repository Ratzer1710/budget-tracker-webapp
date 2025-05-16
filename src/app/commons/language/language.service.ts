import { Injectable } from '@angular/core';
import { Language } from './language.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  
  private availableLanguagesSubject: BehaviorSubject<Language[]> = new BehaviorSubject<Language[]>([
    new Language('en', 'English', false),
    new Language('es', 'Español', false)
  ]);

  availableLanguages$: Observable<Language[]> = this.availableLanguagesSubject.asObservable();
  private storageKey = 'settings_lang';

  constructor(private translateService: TranslateService) {
    this.loadLang();
  }

  private loadLang() {
    const savedLang = localStorage.getItem(this.storageKey);
    const currentLanguages = this.availableLanguagesSubject.value;

    const matchedLang = currentLanguages.find(lang => lang.locale === savedLang);
    
    if (matchedLang) {
      matchedLang.isSelected = true;
      this.setLanguage(matchedLang.locale)
    } else {
      this.setLanguage('en');
    }
  }

  private setLanguageInTranslate(locale: string) {
    this.translateService.use(locale);
  }

  setLanguage(locale: string) {
    const currentLanguages = this.availableLanguagesSubject.value;
    const newLang = currentLanguages.find(lang => lang.locale === locale);

    if (newLang) {
      currentLanguages.forEach(lang => lang.isSelected = false);
      newLang.isSelected = true;
      
      this.availableLanguagesSubject.next([...currentLanguages]);

      localStorage.setItem(this.storageKey, locale);

      this.setLanguageInTranslate(locale);
    }
  }
}
