import { Component, OnInit } from '@angular/core';
import { JobListing } from 'src/app/entities/job-listing';
import { JobListingService } from 'src/app/services/job-listing.service';
import { Application } from 'src/app/entities/application';
import { JobApplicationService } from 'src/app/services/job-application.service';
import { Router } from '@angular/router';
import { JobListingStatusEnum } from 'src/app/models/job-listing-status-enum';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { JobAppsReturnStatusEnum, JobAppsStatusEnum } from 'src/app/models/job-apps-status-enum';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { ErrorMessageEnum } from 'src/app/models/error-message-enum';

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
  jobApplications: Application[] = [];
  loggedInUserId!:any;
  jobListingStatuses: String [] = [];
  jobApplicationStatuses: String [] = [];

  classname: string = DashboardComponent.name;

  jobApplications1: Application[] = [
    {
      id: 1,
      jobListing: this.jobListings[0],
      jobId: 1,
      applicantId: 1,
      description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
      status: 'Pending'
    },
    {
      id: 1,
      jobListing: this.jobListings[1],
      jobId: 1,
      applicantId: 1,
      description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
      status: 'Pending'
    }
  ];
  selectedJobListingStatus!: String;
  selectedJobAppStatus!: String;

  constructor(private router: Router,
    private jobListingService: JobListingService,
    private jobApplicationService: JobApplicationService,
    private sessionStorageService: SessionStorageService, 
    private commonService: CommonService,
    private loggerService: LogService) { }

  ngOnInit(): void {
    // this.getUserInfo(this.token.getUsername()).then((resolve: any) => {
    //   this.getJobListingByUser(this.user.id);
    // });
    this.loggedInUserId=this.getLoggedInUserId();
    this.setFilters();
    this.getJobApplicationByUser(this.loggedInUserId, Object.entries(JobAppsReturnStatusEnum).find(([key, val]) => val === this.selectedJobAppStatus)?.[0]|| '');
    this.getJobListingByUser(this.loggedInUserId, Object.entries(JobListingStatusEnum).find(([key, val]) => val === this.selectedJobListingStatus)?.[0]|| '');
  }
  getLoggedInUserId(): any {
    //let userId = this.sessionStorageService.getID('id');
    let userId = this.sessionStorageService.getSessionStorage('id');
    if(userId==null){
      this.loggerService.error(ErrorMessageEnum.emptyUserId, this.classname);
      this.router.navigate(["/accessDenied"]);
    }else{
      return userId;
    }
  }
  getJobApplicationByUser(userId: number, status: String) {
    this.jobApplicationService.getApplicationByUser(userId, status).subscribe(response => {
      this.jobApplications = response;
      this.jobApplications.forEach((element) => {
        this.jobListingService.getJobListingById(element.jobId).subscribe(response => {
          element.jobListing = response;
          element.status = Object.entries(JobAppsReturnStatusEnum).find(([key, val]) => key === element.status)?.[1]|| '';
          this.commonService.checkJobAppBeforeDisplay(element.jobListing.title, element.jobListing.details, element.status, element.id, this.classname);
        })

      });
    });
  }

  getJobListingByUser(authorId: number, status: String) {
    this.jobListingService.getJobListingByUserAndStatus(authorId, status).subscribe(response => {
      console.log(response);
        this.jobListings = response;
        this.jobListings.forEach((element) => {
          element.status = Object.entries(JobListingStatusEnum).find(([key, val]) => key === element.status)?.[1]|| '';
          this.commonService.checkJobListingBeforeDisplay(element.title, element.details, element.rate, element.status, element.id, this.classname);
        });
        
      }
    );
  }

  setFilters(){
    this.jobListingStatuses.push("All");
    this,this.jobApplicationStatuses.push("All");
    for (let item in JobListingStatusEnum) {
      this.jobListingStatuses.push(Object.entries(JobListingStatusEnum).find(([key, val]) => key === item)?.[1]|| '')
    }

    for (let item in JobAppsReturnStatusEnum) {
      this.jobApplicationStatuses.push(Object.entries(JobAppsReturnStatusEnum).find(([key, val]) => key === item)?.[1]|| '')
    }

    this.selectedJobAppStatus = this.jobApplicationStatuses[0];
    this.selectedJobListingStatus = this.jobListingStatuses[0];
  }

  openListing(listingUrl: String, jobId: number) {
    console.log("open listing called"+listingUrl);
    let source = window.location.origin;
    console.log("source: " + source);
    this.sessionStorageService.setSessionStorage('jobId', jobId);
    this.router.navigate([listingUrl]);
  }

  onSelectJobListingFilter(selectedJobListingStatus: String) {
    console.log(selectedJobListingStatus);
    this.selectedJobListingStatus = selectedJobListingStatus;
    this.refreshListings();
  }
  onSelectJobAppFilter(selectedJobAppStatus: String) {
    console.log(selectedJobAppStatus);
    this.selectedJobAppStatus = selectedJobAppStatus;
    this.refreshListings();
  }

  refreshListings(){
    this.getJobApplicationByUser(this.loggedInUserId, Object.entries(JobAppsReturnStatusEnum).find(([key, val]) => val === this.selectedJobAppStatus)?.[0]|| '');
    this.getJobListingByUser(this.loggedInUserId, Object.entries(JobListingStatusEnum).find(([key, val]) => val === this.selectedJobListingStatus)?.[0]|| '');
  }

}
