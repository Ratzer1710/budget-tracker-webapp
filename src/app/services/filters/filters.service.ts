import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter, Sort } from './filters.model';
import { Type } from '../movements/movement.model';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  private filtersSubject: BehaviorSubject<Filter> = new BehaviorSubject<Filter>({sort: Sort.LATEST, from: null, to: null, type: null, categories: []});
  filters$: Observable<Filter> = this.filtersSubject.asObservable();

  setSort(sort: Sort): void {
    var filter: Filter = this.filtersSubject.value;
    filter.sort = sort;
    this.filtersSubject.next(filter);
  }

  setType(type: Type | null): void {
    var filter: Filter = this.filtersSubject.value;
    filter.type = type;
    this.filtersSubject.next(filter);
  }

  addCategory(category: string): void {
    var filter: Filter = this.filtersSubject.value;
    filter.categories.push(category);
    this.filtersSubject.next(filter);
  }

  removeCategory(category: string): void {
    var filter: Filter = this.filtersSubject.value;
    filter.categories = filter.categories.filter(item => item !== category);
    this.filtersSubject.next(filter);
  }

  resetFilters(): void {
    this.filtersSubject.next({sort: Sort.LATEST, from: null, to: null, type: null, categories: []})
  }

  setDates(from: Date, to: Date): void {
    var filter: Filter = this.filtersSubject.value;
    filter.from = from;
    filter.to = to;
    this.filtersSubject.next(filter);
  }
}
