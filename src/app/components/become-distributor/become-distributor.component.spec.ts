import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BecomeDistributorComponent } from './become-distributor.component';

describe('BecomeDistributorComponent', () => {
  let component: BecomeDistributorComponent;
  let fixture: ComponentFixture<BecomeDistributorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeDistributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeDistributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
