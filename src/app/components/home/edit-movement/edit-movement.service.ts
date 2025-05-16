import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movement, Type } from '../../../services/movements/movement.model';

@Injectable({
  providedIn: 'root',
})
export class EditMovementService {
  private showEditMovementSubject: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  showEditMovement$: Observable<boolean> =
    this.showEditMovementSubject.asObservable();

  private movementToEditSubject: BehaviorSubject<Movement> =
    new BehaviorSubject<Movement>({
      id: 0,
      date: new Date(),
      type: Type.INCOME,
      value: 0,
      total: 0,
      category: '',
      description: '',
    });
  movementToEdit$: Observable<Movement> =
    this.movementToEditSubject.asObservable();

  showModal(): void {
    this.showEditMovementSubject.next(true);
  }

  hideModal(): void {
    this.showEditMovementSubject.next(false);
  }

  setMovement(movement: Movement): void {
    this.movementToEditSubject.next(movement);
  }
}
