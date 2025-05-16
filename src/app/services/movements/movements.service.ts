import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movement } from './movement.model';
import { BudgetService } from '../budget/budget.service';
import { Filter, Sort } from '../filters/filters.model';
import { FiltersService } from '../filters/filters.service';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private baseUrl: string = 'http://localhost:8080/budgets/';

  private activeBudget: string = '';

  private movementsSubject: BehaviorSubject<Movement[]> = new BehaviorSubject<
    Movement[]
  >([]);
  public movements$: Observable<Movement[]> =
    this.movementsSubject.asObservable();

  private categoriesSubject: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  public categories$: Observable<string[]> =
    this.categoriesSubject.asObservable();

  private filter!: Filter;

  constructor(
    private http: HttpClient,
    budgetService: BudgetService,
    filterService: FiltersService
  ) {
    budgetService.activeBudget$.subscribe((budget) => {
      if (budget.name !== '') {
        this.activeBudget = budget.name;
        this.categoriesSubject.next(budget.categories);
        filterService.resetFilters();
        this.loadMovements();
      }
    });

    filterService.filters$.subscribe((filter) => {
      this.filter = filter;
      this.loadMovements();
    });
  }

  public loadMovements(): void {
    if (!this.activeBudget) {
      return;
    }

    var fromString;
    var toString;

    if (this.filter.from && this.filter.to) {
      fromString = this.toLocalDateString(this.filter.from );
      toString = this.toLocalDateString(this.filter.to);
    } else {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      fromString = this.toLocalDateString(firstDayOfMonth);
      toString = this.toLocalDateString(today);
    }

    const url: string =
      this.baseUrl +
      this.activeBudget +
      '/movements?from=' +
      fromString +
      '&to=' +
      toString;
    this.http.get(url).subscribe((movements: any) => {
      movements = this.filterByCategories(movements);
      movements = this.filterMovements(movements);
      this.sortMovements(movements);
      this.movementsSubject.next(movements);
    });
  }

  private toLocalDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public createMovement(movement: unknown): Observable<Movement> {
    const url: string = this.baseUrl + this.activeBudget + '/movements';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Movement>(url, movement, { headers });
  }

  public updateMovement(movement: Movement): Observable<void> {
    const url: string = this.baseUrl + this.activeBudget + '/movements/' + movement.id;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<void>(url, movement, { headers });
  }

  public deleteMovement(id: number): Observable<void> {
    const url: string = this.baseUrl + this.activeBudget + '/movements/' + id;
    return this.http.delete<void>(url);
  }

  filterByCategories(movements: Movement[]): Movement[] {
    return this.filter.categories.length === 0
      ? movements
      : movements.filter(movement => this.filter.categories.includes(movement.category));
  }  

  filterMovements(movements: Movement[]): Movement[] {
    return this.filter.type
      ? movements.filter((movement) => movement.type === this.filter.type)
      : movements;
  }

  sortMovements(movements: Movement[]): void {
    movements.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      const dateComparison = dateA - dateB;

      if (this.filter.sort === Sort.LATEST) {
        return dateComparison !== 0 ? -dateComparison : b.id - a.id;
      } else {
        return dateComparison !== 0 ? dateComparison : a.id - b.id;
      }
    });
  }
}
