import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class NewBudgetService {
    private showNewBudgetSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    showNewBudget$: Observable<boolean> = this.showNewBudgetSubject.asObservable();

    showModal(): void {
        this.showNewBudgetSubject.next(true);
    }

    hideModal(): void {
        this.showNewBudgetSubject.next(false);
    }
}