import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Currency } from '../../../services/budget/budget.model';
import { BudgetService } from '../../../services/budget/budget.service';
import { BudgetType } from './budget-type.enum';

@Component({
  selector: 'app-budget-card',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, TranslateModule],
  templateUrl: './budget-card.component.html',
  styleUrl: './budget-card.component.scss'
})
export class BudgetCardComponent {
  @Input('card-class') cardClass: string = '';
  @Input('title') title: string = '';
  @Input('type') type: BudgetType = BudgetType.BALANCE;
  @Input('aux') aux: string = '';
  lang: string = 'en';

  value: number = 0;

  constructor(translateService: TranslateService, private budgetService: BudgetService) {
    this.lang = translateService.currentLang || this.lang;

    translateService.onLangChange.subscribe(event => {
      this.lang = event.lang;
    });

    this.budgetService.activeBudget$.subscribe((budget) => {
      if (this.type === BudgetType.INCOME) {
        this.value = budget.income;
      } else if (this.type === BudgetType.EXPENSE) {
        this.value = budget.expenses;
      } else {
        this.value = budget.balance;
      }
    })
  }

  getValueClass(): string {
    if (this.value < 1000) {
      return 'budget-card-value-l';
    } else if (this.value >= 1000 && this.value < 1000000) {
      return 'budget-card-value-m';
    } else {
      return 'budget-card-value-s';
    }
  }
}
