import { Component, OnInit } from '@angular/core';
import { JobListing } from 'src/app/entities/job-listing';
import { JobListingService } from 'src/app/services/job-listing.service';
import { Application } from 'src/app/entities/application';
import { JobApplicationService } from 'src/app/services/job-application.service';
import { Router } from '@angular/router';
import { JobListingStatusEnum } from 'src/app/models/job-listing-status-enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  jobListings1: JobListing[] = [
    {
      id: 1,
    authorId: 1,
    title: 'Urgently need UI/UX developer',
    details: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
    rate: '$50',
    rateType: '/hour',
    status: 'Open For Application',
    dateCreated: new Date()
    },
    {
      id: 1,
    authorId: 1,
    title: 'Urgentlyy need UI/UX developer',
    details: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
    rate: '$50',
    rateType: '/hour',
    status: 'Open For Application',
    dateCreated: new Date()
    }
  ];

  jobListings: JobListing[] = [];

  jobApplications: Application[] = [
    {
      id: 1,
      jobListing: this.jobListings[0],
      applicantId: 1,
      description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
      status: 'Pending'
    },
    {
      id: 1,
      jobListing: this.jobListings[1],
      applicantId: 1,
      description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
      status: 'Pending'
    }
  ];

  constructor(private router: Router,
    private jobListingService: JobListingService) { }

  ngOnInit(): void {
    // this.getUserInfo(this.token.getUsername()).then((resolve: any) => {
    //   this.getJobListingByUser(this.user.id);
    // });

    this.getJobListingByUser(1);
  }

  getJobListingByUser(authorId: number) {
    this.jobListingService.getJobListingByUser(authorId).subscribe(response => {
      console.log(response);
        this.jobListings = response;
        this.jobListings.forEach((element) => {
          element.status = Object.entries(JobListingStatusEnum).find(([key, val]) => key === element.status)?.[1]|| '';
        });
      }
    );
  }

  openListing(listingUrl: String) {
    console.log("open listing called"+listingUrl);
    let source = window.location.origin;
    console.log("source: " + source)
    this.router.navigate([listingUrl]);
  }

}
