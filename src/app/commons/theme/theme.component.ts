import { Component, signal } from '@angular/core';
import { ThemeService } from './theme.service';
import { Theme } from './theme.enum';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss'
})
export class ThemeComponent {
  isDarkMode = signal(true);

  constructor(private themeService: ThemeService) {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode.set(theme === Theme.DARK);
    });
  }

  toggleTheme(event: Event) {
    const input = event.target as HTMLInputElement;
    this.themeService.setTheme(input.checked ? Theme.DARK : Theme.LIGHT);
  }
}