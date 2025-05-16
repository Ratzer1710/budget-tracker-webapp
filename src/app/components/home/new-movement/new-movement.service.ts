import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class NewMovementService {
    private showNewMovementSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    showNewMovement$: Observable<boolean> = this.showNewMovementSubject.asObservable();

    showModal(): void {
        this.showNewMovementSubject.next(true);
    }

    hideModal(): void {
        this.showNewMovementSubject.next(false);
    }
}