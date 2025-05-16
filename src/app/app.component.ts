import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeComponent } from "./commons/theme/theme.component";
import { LanguageComponent } from "./commons/language/language.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { BudgetService } from './services/budget/budget.service';
import { MovementService } from './services/movements/movements.service';
import { FiltersService } from './services/filters/filters.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeComponent, LanguageComponent, SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'budget-tracker-webapp';

  constructor(budgetsService: BudgetService, filterService: FiltersService, movementService: MovementService) {
    budgetsService.loadBudgets();
  }
}
