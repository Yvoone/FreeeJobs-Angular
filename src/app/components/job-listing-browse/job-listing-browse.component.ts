import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobListing } from 'src/app/entities/job-listing';
import { JobListingStatusEnum } from 'src/app/models/job-listing-status-enum';
import { JobListingService } from 'src/app/services/job-listing.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-job-listing-browse',
  templateUrl: './job-listing-browse.component.html',
  styleUrls: ['./job-listing-browse.component.css']
})
export class JobListingBrowseComponent implements OnInit {

  jobListings: JobListing[] = [];
  totalJobListing!: number;
  listingSearch!: string;

  constructor(private router: Router,
    private jobListingService: JobListingService,
    private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    this.listingSearch = "";
    this.getJobListingToBrowseTotal(this.listingSearch);
    this.getJobListingToBrowse(this.p, this.listingSearch);

  }
  // initializing page number to one
  p: number = 1;

  getJobListingToBrowse(pageNumber: number, searchValue: string) {
    this.jobListingService.getJobListingToBrowse(pageNumber, searchValue).subscribe(response => {
      console.log(response);
        this.jobListings = response;
        this.jobListings.forEach((element) => {
          element.status = Object.entries(JobListingStatusEnum).find(([key, val]) => key === element.status)?.[1]|| '';
        });
      }
    );
  }

  //get number of joblisting  for pagination
  getJobListingToBrowseTotal(searchValue: string) {
    this.jobListingService.getJobListingToBrowseTotal(searchValue).subscribe(response => {
      console.log('totalll'+response);
        this.totalJobListing = response;
        if(typeof this.totalJobListing!="number"){
          //throw error
        }
      }
    );
  }

  openListing(listingUrl: String, jobId: number) {
    console.log("open listing called"+listingUrl);
    let source = window.location.origin;
    console.log("source: " + source);
    this.sessionStorageService.setSessionStorage('jobId', jobId);
    this.router.navigate([listingUrl]);
  }

  refresh(p:number){
    this.getJobListingToBrowseTotal(this.listingSearch);
    this.getJobListingToBrowse(this.p, this.listingSearch);
  }

  search() {
    console.log(this.listingSearch);
    this.refresh(this.p);
  }
}
