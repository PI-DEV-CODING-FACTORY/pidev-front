import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionDetailsComponent } from './inscription-details.component';

describe('InscriptionDetailsComponent', () => {
  let component: InscriptionDetailsComponent;
  let fixture: ComponentFixture<InscriptionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscriptionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
