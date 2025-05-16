import { Component } from '@angular/core';
import { BudgetCardComponent } from './budget-card/budget-card.component';
import { MovementsComponent } from './movements/movements.component';
import { BudgetService } from '../../services/budget/budget.service';
import { Budget } from '../../services/budget/budget.model';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NewBudgetComponent } from './new-budget/new-budget.component';
import { NewBudgetService } from './new-budget/new-budget.service';
import { BudgetType } from './budget-card/budget-type.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BudgetCardComponent,
    MovementsComponent,
    TranslateModule,
    CommonModule,
    NewBudgetComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  budget: Budget | null = null;
  month: number = -1;

  isModalVisible: boolean = false;

  budgetType = BudgetType;

  constructor(
    private budgetService: BudgetService,
    private newBudgetService: NewBudgetService
  ) {
    this.budgetService.activeBudget$.subscribe(
      (budget) => (this.budget = budget)
    );

    this.newBudgetService.showNewBudget$.subscribe(
      (showModal) => (this.isModalVisible = showModal)
    );
  }

  get monthAux(): string {
    const today = new Date();
    return 'calendar.months.' + (today.getMonth() + 1);
  }

  showModal(): void {
    this.newBudgetService.showModal();
  }
}
