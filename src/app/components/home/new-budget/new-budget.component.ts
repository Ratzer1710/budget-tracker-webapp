import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Budget, Currency } from '../../../services/budget/budget.model';
import { BudgetService } from '../../../services/budget/budget.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NewBudgetService } from './new-budget.service';

@Component({
  selector: 'app-new-budget',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './new-budget.component.html',
  styleUrl: './new-budget.component.scss',
})
export class NewBudgetComponent {
  budgetForm: FormGroup;
  newCategoryControl: FormControl = new FormControl('', Validators.required);
  currencyOptions = Object.values(Currency);
  isVisible: boolean = false;

  constructor(
    private budgetService: BudgetService,
    private newBudgetService: NewBudgetService,
    private fb: FormBuilder
  ) {
    this.budgetForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      currency: ['', Validators.required],
      balance: [, [Validators.required, Validators.min(0)]],
      categories: this.fb.array([], [Validators.required, Validators.minLength(1)]),
    });

    this.newBudgetService.showNewBudget$.subscribe((showModal) => {
      if (!showModal) {
        this.categories.controls = [];
        this.budgetForm.reset();
      }

      this.isVisible = showModal;
    });
  }

  get categories(): FormArray {
    return this.budgetForm.get('categories') as FormArray;
  }

  addCategory() {
    const categoryName = this.newCategoryControl.value.trim();
    if (categoryName && !this.categories.value.includes(categoryName)) {
      this.categories.push(this.fb.control(categoryName, Validators.required));
      this.newCategoryControl.reset();
    }
  }

  removeCategory(index: number) {
    this.categories.removeAt(index);
  }

  handleCategoryKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.addCategory();
      event.preventDefault();
    }
  }

  createBudget() {
    if (this.budgetForm.valid) {
      const budget = this.budgetForm.value;
      this.budgetService.createBudget(budget).subscribe((budget: Budget) => {
        this.budgetService.selectActiveBudget(budget.name);
        this.budgetService.loadBudgets();
        this.close();
      });
    }
  }

  close(): void {
    this.newBudgetService.hideModal();
  }
}