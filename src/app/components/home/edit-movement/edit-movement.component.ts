import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Type } from '../../../services/movements/movement.model';
import { MovementService } from '../../../services/movements/movements.service';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BudgetService } from '../../../services/budget/budget.service';
import { EditMovementService } from './edit-movement.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-edit-movement',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    NgbDatepickerModule,
  ],
  templateUrl: './edit-movement.component.html',
  styleUrl: './edit-movement.component.scss',
})
export class EditMovementComponent {
  movementForm: FormGroup;
  typeOptions = Object.values(Type);
  categories: string[] = [];
  isVisible: boolean = false;
  movementId: number = 0;

  constructor(
    private movementService: MovementService,
    private editMovementService: EditMovementService,
    private budgetService: BudgetService,
    private fb: FormBuilder
  ) {
    this.movementForm = this.fb.group({
      date: [this.toNgbDateStruct(new Date()), [Validators.required]],
      type: ['', Validators.required],
      value: [, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      description: ['', Validators.required],
    });

    combineLatest([
      this.editMovementService.showEditMovement$,
      this.editMovementService.movementToEdit$,
    ]).subscribe(([showModal, movement]) => {
      this.isVisible = showModal;

      if (showModal && movement) {
        this.movementId = movement.id;
        this.movementForm.patchValue({
          date: this.toNgbDateStruct(new Date(movement.date)),
          type: movement.type,
          value: movement.value,
          category: movement.category,
          description: movement.description,
        });
      } else if (!showModal) {
        this.movementForm.reset({
          date: this.toNgbDateStruct(new Date()),
          type: '',
          value: null,
          category: '',
          description: '',
        });
      }
    });

    this.movementService.categories$.subscribe(
      (categories) => (this.categories = categories)
    );
  }

  updateMovement() {
    if (this.movementForm.valid) {
      const movement = this.movementForm.value;
      movement.date = this.toDate(movement.date);
      movement.id = this.movementId;
      this.movementService.updateMovement(movement).subscribe(() => {
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
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    };
  }  

  close(): void {
    this.editMovementService.hideModal();
  }
}
