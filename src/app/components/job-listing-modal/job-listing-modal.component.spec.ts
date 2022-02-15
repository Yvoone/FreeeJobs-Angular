import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListingModalComponent } from './job-listing-modal.component';

describe('JobListingModalComponent', () => {
  let component: JobListingModalComponent;
  let fixture: ComponentFixture<JobListingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobListingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobListingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
