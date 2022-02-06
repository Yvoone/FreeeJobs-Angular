import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobListing } from 'src/app/entities/job-listing';
import { JobListingService } from 'src/app/services/job-listing.service';

@Component({
  selector: 'app-job-listing-details',
  templateUrl: './job-listing-details.component.html',
  styleUrls: ['./job-listing-details.component.css']
})
export class JobListingDetailsComponent implements OnInit {

  id!: number;
  jobListing!: JobListing;

  constructor(
    private activatedRoute: ActivatedRoute,
    private jobListingService: JobListingService
  ) {}

  ngOnInit(): void {
    console.log("open listing details");
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getJobDetails(this.id);
  }

  getJobDetails(id: number) {
    this.jobListingService.getJobListingById(id).subscribe(response => {
        this.jobListing = response;
      }
    );
  }

}
