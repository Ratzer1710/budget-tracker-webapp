import { Component, HostListener } from '@angular/core';
import { Language } from './language.model';
import { LanguageService } from './language.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './language.component.html',
  styleUrl: './language.component.scss'
})
export class LanguageComponent {
  langs: Language[] = [];
  isDropdownOpen: boolean = false;

  constructor(private languageService: LanguageService) {
    this.languageService.availableLanguages$.subscribe((langs) => {
      this.langs = langs;
    })
  }

  onToggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onChangeLanguage(locale: string): void {
    this.isDropdownOpen = false;
    this.languageService.setLanguage(locale);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const languageSelector = document.querySelector('.language-selector');
    const languageDropdown = document.querySelector('.language-selector-dropdown');
    
    if (
      languageSelector && !languageSelector.contains(event.target as Node) &&
      languageDropdown && !languageDropdown.contains(event.target as Node)
    ) {
      this.isDropdownOpen = false;
    }
  }
}
