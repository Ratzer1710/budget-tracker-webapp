import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class DeleteBudgetService {
    private showDeleteBudgetSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    showDeleteBudget$: Observable<boolean> = this.showDeleteBudgetSubject.asObservable();

    private deleteBudgetNameSubject: BehaviorSubject<string> = new BehaviorSubject('');
    deleteBudgetName$: Observable<string> = this.deleteBudgetNameSubject.asObservable();

    setDeleteBudgetName(name: string): void {
        this.deleteBudgetNameSubject.next(name);
    }

    showPopup(): void {
        this.showDeleteBudgetSubject.next(true);
    }

    hidePopup(): void {
        this.showDeleteBudgetSubject.next(false);
    }
}