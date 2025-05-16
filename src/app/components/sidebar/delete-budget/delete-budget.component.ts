import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteBudgetService } from './delete-budget.service';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../../services/budget/budget.service';
import { MovementService } from '../../../services/movements/movements.service';

@Component({
  selector: 'app-delete-budget',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './delete-budget.component.html',
  styleUrl: './delete-budget.component.scss',
})
export class DeleteBudgetComponent {
  isVisible: boolean = false;
  name: string = '';

  constructor(
    private deleteBudgetService: DeleteBudgetService,
    private budgetService: BudgetService,
    private movementsService: MovementService
  ) {
    this.deleteBudgetService.showDeleteBudget$.subscribe(
      (isVisible) => (this.isVisible = isVisible)
    );
    this.deleteBudgetService.deleteBudgetName$.subscribe(
      (name) => (this.name = name)
    );
  }

  close(): void {
    this.deleteBudgetService.hidePopup();
    this.deleteBudgetService.setDeleteBudgetName('');
  }

  deleteBudget(): void {
    this.budgetService.deleteBudget(this.name).subscribe(() => {
      this.budgetService.loadBudgets();
      this.movementsService.loadMovements();
    });
    this.close();
  }
}
