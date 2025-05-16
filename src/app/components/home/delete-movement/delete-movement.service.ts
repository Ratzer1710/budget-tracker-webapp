import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class DeleteMovementService {
    private showDeleteMovementSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    showDeleteMovement$: Observable<boolean> = this.showDeleteMovementSubject.asObservable();

    private movementIdSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    movementId$: Observable<number> = this.movementIdSubject.asObservable();

    setMovementId(id: number): void {
        this.movementIdSubject.next(id);
    }

    showPopup(): void {
        this.showDeleteMovementSubject.next(true);
    }

    hidePopup(): void {
        this.showDeleteMovementSubject.next(false);
    }
}