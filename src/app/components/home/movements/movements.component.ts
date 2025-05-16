import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Movement, Type } from '../../../services/movements/movement.model';
import { MovementService } from '../../../services/movements/movements.service';
import { LocalizedDatePipe } from '../../../commons/datePipe/date-pipe.pipe';
import { NewMovementService } from '../new-movement/new-movement.service';
import { NewMovementComponent } from '../new-movement/new-movement.component';
import { DeleteMovementService } from '../delete-movement/delete-movement.service';
import { DeleteMovementComponent } from '../delete-movement/delete-movement.component';
import { Filter, Sort } from '../../../services/filters/filters.model';
import { FiltersService } from '../../../services/filters/filters.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BudgetService } from '../../../services/budget/budget.service';
import { EditMovementService } from '../edit-movement/edit-movement.service';
import { EditMovementComponent } from "../edit-movement/edit-movement.component";

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    LocalizedDatePipe,
    NewMovementComponent,
    DeleteMovementComponent,
    NgbModule,
    EditMovementComponent
],
  templateUrl: './movements.component.html',
  styleUrl: './movements.component.scss',
})
export class MovementsComponent {
  movements: Movement[] = [];

  filter!: Filter;

  type = Type;

  availableCategories: string[] = [];

  topCategories: string[] = [];

  sortOptions: Sort[] = Object.values(Sort);

  constructor(
    private movementsService: MovementService,
    private newMovementService: NewMovementService,
    private deleteMovementService: DeleteMovementService,
    private editMovementService: EditMovementService,
    private filterService: FiltersService,
    budgetService: BudgetService
  ) {
    this.movementsService.movements$.subscribe((movements) => {
      this.movements = movements;
      this.topCategories = this.getTopCategories(movements, this.availableCategories);
    });

    this.filterService.filters$.subscribe((filter) => {
      this.filter = filter;
    });

    budgetService.activeBudget$.subscribe((budget) => {
      this.availableCategories = budget.categories;
    });
  }

  openNewMovementModal(): void {
    this.newMovementService.showModal();
  }

  openDeleteMovementPopup(id: number): void {
    this.deleteMovementService.setMovementId(id);
    this.deleteMovementService.showPopup();
  }

  openEditMovementPopup(movement: Movement): void {
    this.editMovementService.setMovement(movement);
    this.editMovementService.showModal();
  }

  getSortText(sort: Sort): string {
    if (sort === Sort.LATEST) {
      return 'filters.sort.latest';
    } else {
      return 'filters.sort.oldest';
    }
  }

  setSortFilter(sort: Sort): void {
    this.filterService.setSort(sort);
  }

  setTypeFilter(type: Type | null): void {
    if (type === this.filter.type) {
      type = null;
    }

    this.filterService.setType(type);
  }

  toggleCategory(category: string): void{
    if (this.filter.categories.includes(category)) {
      this.filterService.removeCategory(category);
    } else {
      this.filterService.addCategory(category);
    }
  }

  getTopCategories(movements: Movement[], availableCategories: string[]): string[] {
    const categoryCounts = availableCategories.reduce((counts, category) => {
      counts[category] = 0;
      return counts;
    }, {} as { [key: string]: number });
  
    movements.forEach(movement => {
      if (categoryCounts.hasOwnProperty(movement.category)) {
        categoryCounts[movement.category] += 1;
      }
    });
  
    const sortedCategories = availableCategories
      .sort((a, b) => categoryCounts[b] - categoryCounts[a]);
  
    return sortedCategories.slice(0, 5);
  }  

  cleanFilters(): void {
    this.filterService.resetFilters();
  }

  setPreviousMonth() {
    var from;
    var to;
    if (this.filter.from && this.filter.to) {
      from = new Date(this.filter.from.getFullYear(), this.filter.from.getMonth() - 1, 1);
      to = new Date(this.filter.from.getFullYear(), this.filter.from.getMonth(), 0);
    } else {
      from = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
      to = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
    }
    this.filterService.setDates(from, to);
  }

  setNextMonth() {
    var from;
    var to;
    if (this.filter.from && this.filter.to) {
      from = new Date(this.filter.from.getFullYear(), this.filter.from.getMonth() + 1, 1);
      to = new Date(this.filter.from.getFullYear(), this.filter.from.getMonth() + 2, 0);
    } else {
      from = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
      to = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0);
    }
    this.filterService.setDates(from, to);
  }

  get prevMonth() {
    if (this.filter.from) {
      return "calendar.months." + this.filter.from.getMonth();
    } else {
      return "calendar.months." + (new Date().getMonth());
    }
  }

  get nextMonth() {
    if (this.filter.to) {
      return "calendar.months." + (this.filter.to.getMonth() + 2);
    } else {
      return "calendar.months." + (new Date().getMonth() + 2);
    }
  }
}
