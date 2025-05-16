import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from './theme.enum';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(Theme.DARK);
  theme$ = this.themeSubject.asObservable();

  private storageKey = 'settings_theme';
  
  private darkTheme = 'dark';
  private lightTheme = 'light';

  constructor() {
    this.loadTheme();
  }

  setTheme(theme: Theme) {
    this.resetThemeClass();
    document.body.classList.add(theme);
    this.themeSubject.next(theme);
    localStorage.setItem(this.storageKey, theme);
  }

  private resetThemeClass() {
    document.body.classList.remove(this.darkTheme);
    document.body.classList.remove(this.lightTheme);
  }

  private loadTheme() {
    const savedTheme = (localStorage.getItem(this.storageKey) as Theme) || Theme.DARK;
    this.setTheme(savedTheme);
  }
}