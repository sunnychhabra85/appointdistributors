import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PostRequirementComponent } from './post-requirement.component';

describe('PostRequirementComponent', () => {
  let component: PostRequirementComponent;
  let fixture: ComponentFixture<PostRequirementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PostRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
