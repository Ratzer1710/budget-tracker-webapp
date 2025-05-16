import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Budget, Currency } from './budget.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private baseUrl: string = 'http://localhost:8080/budgets';

  private activeBudgetKey: string = 'activeBudget';

  private budgetsSubject: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  public budgets$: Observable<string[]> = this.budgetsSubject.asObservable();

  private activeBudgetSubject: BehaviorSubject<Budget> = new BehaviorSubject<Budget>({name: '', currency: Currency.ARS, balance: 0, income: 0, expenses: 0, categories: []});
  public activeBudget$: Observable<Budget> = this.activeBudgetSubject.asObservable();

  constructor(private http: HttpClient) {}

  public loadBudgets(): void {
    this.http.get(this.baseUrl).subscribe((budgets: any) => {
      this.budgetsSubject.next(budgets);
      const activeBudget: string | null = localStorage.getItem(this.activeBudgetKey);
      
      if (activeBudget && budgets.includes(activeBudget)) {
        this.selectActiveBudget(activeBudget);
      } else if (budgets.length > 0) {
        this.selectActiveBudget(budgets[0]);
      }

    });
  }

  public selectActiveBudget(name: string): void {
    localStorage.setItem(this.activeBudgetKey, name);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.getBudget(name, firstDayOfMonth, today).subscribe((budget) => this.activeBudgetSubject.next(budget));
  }

  public getBudget(name: string, from: Date, to: Date): Observable<Budget> {
    const fromString = this.toLocalDateString(from);
    const toString = this.toLocalDateString(to);

    const url = this.baseUrl + '/' + name + '?from=' + fromString + '&to=' + toString;

    return this.http.get<Budget>(url);
  }

  private toLocalDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public createBudget(budget: unknown): Observable<Budget> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Budget>(this.baseUrl, budget, { headers });
  }

  public deleteBudget(name: string): Observable<void> {
    const url = this.baseUrl + "/" + name;
    return this.http.delete<void>(url);
  }
}
