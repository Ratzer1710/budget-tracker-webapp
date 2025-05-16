import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteMovementService } from './delete-movement.service';
import { MovementService } from '../../../services/movements/movements.service';
import { BudgetService } from '../../../services/budget/budget.service';

@Component({
  selector: 'app-delete-movement',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './delete-movement.component.html',
  styleUrl: './delete-movement.component.scss',
})
export class DeleteMovementComponent {
  isVisible: boolean = false;
  id: number = 0;

  constructor(
    private deleteMovementService: DeleteMovementService,
    private movementService: MovementService,
    private budgetService: BudgetService
  ) {
    this.deleteMovementService.showDeleteMovement$.subscribe(
      (isVisible) => (this.isVisible = isVisible)
    );
    this.deleteMovementService.movementId$.subscribe((id) => (this.id = id));
  }

  close(): void {
    this.deleteMovementService.hidePopup();
  }

  deleteMovement(): void {
    this.movementService
      .deleteMovement(this.id)
      .subscribe(() => {
        this.movementService.loadMovements();
        this.budgetService.loadBudgets();
  });
    this.close();
  }
}
