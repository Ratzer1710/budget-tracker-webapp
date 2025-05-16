import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMovementComponent } from './edit-movement.component';

describe('EditMovementComponent', () => {
  let component: EditMovementComponent;
  let fixture: ComponentFixture<EditMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMovementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
