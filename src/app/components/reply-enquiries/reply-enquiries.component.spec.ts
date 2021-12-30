import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReplyEnquiriesComponent } from './reply-enquiries.component';

describe('ReplyEnquiriesComponent', () => {
  let component: ReplyEnquiriesComponent;
  let fixture: ComponentFixture<ReplyEnquiriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplyEnquiriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
