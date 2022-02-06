import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListingDetailsComponent } from './job-listing-details.component';

describe('JobListingDetailsComponent', () => {
  let component: JobListingDetailsComponent;
  let fixture: ComponentFixture<JobListingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobListingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobListingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
