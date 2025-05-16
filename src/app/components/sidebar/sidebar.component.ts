import { Component } from '@angular/core';
import { BudgetService } from '../../services/budget/budget.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NewBudgetService } from '../home/new-budget/new-budget.service';
import { DeleteBudgetService } from './delete-budget/delete-budget.service';
import { DeleteBudgetComponent } from "./delete-budget/delete-budget.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [TranslateModule, CommonModule, DeleteBudgetComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  budgets: string[] = [];
  activeBudget: string = '';

  showDeleteBudgetPopup: boolean = false;

  constructor(private budgetService: BudgetService, private newBudgetService: NewBudgetService, private deleteBudgetService: DeleteBudgetService) {
    budgetService.budgets$.subscribe((budgets) => this.budgets = budgets);
    budgetService.activeBudget$.subscribe((budget) => this.activeBudget = budget.name);
  }

  selectBudget(budget: string): void {
    this.budgetService.selectActiveBudget(budget);
  }

  showModal(): void {
    this.newBudgetService.showModal();
  }

  showDeletePopup(name: string): void {
    this.deleteBudgetService.setDeleteBudgetName(name);
    this.deleteBudgetService.showPopup();
  }
}
