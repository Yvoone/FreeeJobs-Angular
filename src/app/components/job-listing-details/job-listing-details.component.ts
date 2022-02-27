import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobListing } from 'src/app/entities/job-listing';
import { User } from 'src/app/entities/user';
import { JobListingService } from 'src/app/services/job-listing.service';
import { JobApplicationService } from 'src/app/services/job-application.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Application } from 'src/app/entities/application';
import { IAMService } from 'src/app/services/iam.service';
import { RatingService } from 'src/app/services/rating.service';
import { Rating } from 'src/app/entities/rating';
import { JobListingStatusEnum } from 'src/app/models/job-listing-status-enum';
import { JobAppsStatusEnum } from 'src/app/models/job-apps-status-enum';

@Component({
  selector: 'app-job-listing-details',
  templateUrl: './job-listing-details.component.html',
  styleUrls: ['./job-listing-details.component.css']
})
export class JobListingDetailsComponent implements OnInit {

  id!: number;
  userId!: number;
  jobListing!: JobListing;
  userType!: number;
  appDesc!: String;
  applicantMap = new Map<number, any>();
  // applicants: User[] = [
  //   {
  //     id: 1,
  //   password: "",
  //   firstName: "David",
  //   lastName: "Lee",
  //   email: "davidlee@gmail.com",
  //   contactNo: "99999999",
  //   gender: "male",
  //   dob: "01 Janurary 1999",
  //   aboutMe: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   skills: "java, html, guitar",
  //   linkedInAcct: "abc"
  //   },
  //   {
  //     id: 2,
  //   password: "",
  //   firstName: "July",
  //   lastName: "Lee",
  //   email: "julylee@gmail.com",
  //   contactNo: "99999999",
  //   gender: "female",
  //   dob: "01 Janurary 1999",
  //   aboutMe: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   skills: "java, c+, guitar",
  //   linkedInAcct: "efg"
  //   }
  // ];
  applicants: User[] = [];

  selectedUser!: User;
  selectedDesc!: String;

  ratings: string[] = ['1','2','3','4','5'];
  review!:string;
  reviewTitle!:string;
  selectedRating!:string
  ratingForUserAndJob!: Rating[];
  postedDays!: number;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private jobListingService: JobListingService,
    private modalService: NgbModal,
    private jobApplicationService: JobApplicationService,
    private iamService: IAMService,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    console.log("open listing details");
    //Temp hardcoded
    this.userId = 1;

    this.id = this.activatedRoute.snapshot.params['id'];
    this.getJobDetails(this.id);
    this.getReviewsDoneByUser();

  }

  getJobDetails(id: number) {
    this.jobListingService.getJobListingById(id).subscribe(response => {
        console.log(response);
        this.jobListing = response;
        this.jobListing.status = Object.entries(JobListingStatusEnum).find(([key, val]) => key === this.jobListing.status)?.[1]|| '';
        this.jobListing.dateCreated=new Date(response.dateCreated);
        this.postedDays = Math.floor(Math.floor((new Date).valueOf()- this.jobListing.dateCreated.valueOf())/(1000 * 60 * 60 * 24));
        if (this.isOwnerOfPostIsUser()) {
          //TODO: access management - if status of job is closed, check if user is author or accepted applicant, in case hacker hardcode jobId value
          if (this.isListingPendingCompletion() || this.isListingCompleted()) {
            this.getAcceptedApplicants(this.id);
          }
          else {
            this.getApplicants(this.id);
          }
        }
      }
    );
  }

  openEditPage(url: string){
    this.router.navigate([url]);
  }

  showPopUp(content:any, applicantId: number) {
    console.log(this.applicants);
    this.modalService.open(content, {centered: true });
    if (applicantId > 0) {
      let appValue = this.applicantMap.get(applicantId);

      this.selectedUser = this.applicants[appValue["index"]];
      console.log(this.selectedUser);
      this.selectedDesc = appValue["desc"];
    }
  }

  getApplicantDesc(id: number) {
    let appValue = this.applicantMap.get(id);

    return appValue["desc"];
  }

  applyJob(desc: String) {
    console.log(desc);

    this.jobApplicationService.applyJob(this.id, this.userId, desc).subscribe(response => {
      console.log(response);
      this.modalService.dismissAll();
      }
    );
  }

  getApplicants(id: number) {
    this.jobApplicationService.getApplicantsByJobId(id).subscribe(response => {
       console.log(response);
        this.populateApplicants(response);
      }
    );
  }

  getAcceptedApplicants(id: number) {
    this.jobApplicationService.getAcceptedApplicantsByJobId(id).subscribe(response => {
       console.log(response);
        this.populateApplicants(response);
      }
    );
  }

  populateApplicants(response: any ) {
      let applications: Application[] = response;
      let listApplicants : User[] = [];
      let appInd = 0;
      for (let app of applications) {
        this.iamService.getUserByUserId(app["applicantId"]).subscribe(response => {
            console.log(response);
            listApplicants.push(response);
            let key = app["applicantId"];
            let applicantVal : Object = {
              "index" : appInd,
              "desc" : app["description"]
            }
            this.applicantMap.set(key, applicantVal);
            appInd = appInd + 1;

          }
        );
      }
      this.applicants = listApplicants;
  }

  isOwnerOfPostIsUser() {
    return this.jobListing.authorId==this.userId;
  }
  isAcceptedApplicantOfPostUser() {
    return this.jobListing.authorId==this.userId;
  }
  isListingCompleted(){
    return this.jobListing.status==JobListingStatusEnum.C;
  }
  isListingPendingCompletion(){
    return this.jobListing.status==JobListingStatusEnum.PC;
  }
  isListingOpen(){
    return this.jobListing.status==JobListingStatusEnum.OFA;
  }
  isPendingRating(){
    //to return status==C and no ratings in table
    return (this.jobListing.status==JobListingStatusEnum.C)&&(this.ratingForUserAndJob.length==0)
  }
  getReviewsDoneByUser(){
    //check if user alr submitted rating for this job listing
    this.ratingService.getRatingsByReviewerIdJobId(this.userId, this.id).subscribe(response =>{
      this.ratingForUserAndJob= response;
      console.log(this.ratingForUserAndJob.length);
    });
  }
  showRatingPopUp(content:any) {
    console.log(this.applicants);
    this.modalService.open(content, {centered: true });
  }
  onSelectRating(rating:string){
    this.selectedRating=rating;
  }
  submitRating(review: String, rating: String) {
    console.log(review);
    console.log(rating);
    let targetId: Number| undefined = undefined;
    if(this.jobListing.authorId==this.userId){
      //target of the rating is for freelancer
      targetId = this.applicants[0].id;
    }else{
      //target of the rating is for employer
      targetId = this.jobListing.authorId;
    }
    let newRating = {
      jobId: this.id,
      reviewerId: this.userId,
      targetId: targetId,
      reviewTitle: this.reviewTitle,
      review: review,
      ratingScale: Number(rating)
    }

    this.ratingService.create(newRating).subscribe(response => {
      console.log(response);
      this.modalService.dismissAll();
      setTimeout(() => {
        location.reload();
      }, 2000);
      }
    );
  }

  showCompletePopUp(content:any) {
    console.log(this.applicants);
    this.modalService.open(content, {centered: true });
  }

  completeJob() {
    this.jobListingService.updateJobStatus('C', this.jobListing.id).subscribe(response => {
      console.log(response);
      this.modalService.dismissAll();
    }
    );
  }

  setApplicantsStatus(status: String, applicantId: number) {
    let validStats = true;
    if (status === "ACC") {
      status = JobAppsStatusEnum.ACC;

      this.jobListingService.updateJobStatus('PC', this.jobListing.id).subscribe(response => {
        console.log(response);
        this.modalService.dismissAll();
      }
      );
    }
    else if (status === "REJ") {
      status = JobAppsStatusEnum.REJ;
    }
    else {
      validStats = false;
    }
    if (validStats) {
      this.jobApplicationService.setApplicantsStatus(this.id, applicantId, status).subscribe(response => {
        console.log(response);
        this.modalService.dismissAll();
      }
      );
    }

  }

  deleteJob() {
    this.jobListingService.updateJobStatus('R', this.jobListing.id).subscribe(response => {
      console.log(response);
      this.modalService.dismissAll();
    }
    );

    this.jobApplicationService.closeApplicantsStatus(this.id, JobAppsStatusEnum.CLS).subscribe(response => {
      console.log(response);
      this.modalService.dismissAll();
    }
    );
  }


}
