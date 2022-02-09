import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListingBrowseComponent } from './job-listing-browse.component';

describe('JobListingBrowseComponent', () => {
  let component: JobListingBrowseComponent;
  let fixture: ComponentFixture<JobListingBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobListingBrowseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobListingBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
