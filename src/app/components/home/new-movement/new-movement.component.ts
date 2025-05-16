import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Type } from '../../../services/movements/movement.model';
import { MovementService } from '../../../services/movements/movements.service';
import { NewMovementService } from './new-movement.service';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BudgetService } from '../../../services/budget/budget.service';

@Component({
  selector: 'app-new-movement',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule, NgbDatepickerModule],
  templateUrl: './new-movement.component.html',
  styleUrl: './new-movement.component.scss'
})
export class NewMovementComponent {
  movementForm: FormGroup;
  typeOptions = Object.values(Type);
  categories: string[] = [];
  isVisible: boolean = false;

  constructor(
    private movementService: MovementService,
    private newMovementService: NewMovementService,
    private budgetService: BudgetService,
    private fb: FormBuilder
  ) {
    this.movementForm = this.fb.group({
      date: [this.toNgbDateStruct(new Date()), [Validators.required]],
      type: ['', Validators.required],
      value: [, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.newMovementService.showNewMovement$.subscribe((showModal) => {
      if (!showModal) {
        this.movementForm.reset({
          date: this.toNgbDateStruct(new Date()),
          type: '',
          value: null,
          category: '',
          description: ''
        });
      }

      this.isVisible = showModal;
    });

    this.movementService.categories$.subscribe((categories) => this.categories = categories);
  }

  createMovement() {
    if (this.movementForm.valid) {
      const movement = this.movementForm.value;
      movement.date = this.toDate(movement.date);
      this.movementService.createMovement(movement).subscribe(() => {
        this.budgetService.loadBudgets();
        this.movementService.loadMovements();
        this.close();
      });
    }
  }

  toDate(dateStruct: NgbDateStruct): Date {
    return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
  }

  toNgbDateStruct(date: Date): NgbDateStruct {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }  

  close(): void {
    this.newMovementService.hideModal();
  }
}
