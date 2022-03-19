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
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { ErrorMessageEnum } from 'src/app/models/error-message-enum';

@Component({
  selector: 'app-job-listing-details',
  templateUrl: './job-listing-details.component.html',
  styleUrls: ['./job-listing-details.component.css']
})
export class JobListingDetailsComponent implements OnInit {

  id!: number;
  userId!: any;
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
  aboutClient: String = "";
  applicantStatus: String = "";

  currentRating = 0;
  // ratings: string[] = ['1','2','3','4','5'];
  review!:string;
  reviewTitle!:string;
  // selectedRating!:string
  ratingForUserAndJob!: Rating[];
  postedDays!: number;

  classname: string = JobListingDetailsComponent.name;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private jobListingService: JobListingService,
    private modalService: NgbModal,
    private jobApplicationService: JobApplicationService,
    private iamService: IAMService,
    private ratingService: RatingService,
    private sessionStorageService: SessionStorageService,
    private commonService: CommonService,
    private loggerService: LogService
  ) {}

  ngOnInit(): void {
    console.log("open listing details");
    //Temp hardcoded
    this.userId = this.getLoggedInUserId();

    // this.id = this.activatedRoute.snapshot.params['id'];
    this.id = this.sessionStorageService.getSessionStorage('jobId');
    if (this.id == 0) {
      console.log("Invalid jobId");
      //TODO Redirect page
    }
    this.getJobDetails(this.id);

    this.getReviewsDoneByUser();

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

  getJobDetails(id: number) {
    this.jobListingService.getJobListingById(id).subscribe(response => {
        console.log('responseee'+response.id);
        this.jobListing = response;
        this.jobListing.status = Object.entries(JobListingStatusEnum).find(([key, val]) => key === this.jobListing.status)?.[1]|| '';
        this.jobListing.dateCreated=new Date(response.dateCreated);
        this.commonService.checkJobListingDetailsBeforeDisplay(this.jobListing, this.classname);
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
        else {
          this.getApplicantStatus();
        }
        this.getClientData();
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

    console.log("LoggedUserId", this.sessionStorageService.getSessionStorage('id'));
    console.log("viewApplicantId", this.sessionStorageService.getSessionStorage('applicantProfileId'));
  }

  //John Edit
  routeToApplicantProfile(){
    this.sessionStorageService.removeSessionStorage('applicantProfileId');

    this.sessionStorageService.setSessionStorage('applicantProfileId', this.selectedUser.id);
    this.router.navigate(['/applicantProfile']);
  }
  //End here

  getApplicantDesc(id: number) {
    let appValue = this.applicantMap.get(id);

    return appValue["desc"];
  }

  applyJob(desc: String) {
    console.log(desc);

    this.jobApplicationService.applyJob(this.id, this.userId, desc).subscribe(response => {
      console.log(response);
      this.applicantStatus = JobAppsStatusEnum.PA;
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

  getApplicantStatus() {
    this.jobApplicationService.getUserApplicationStatus(this.id, this.userId).subscribe(response => {
      console.log(response);
      this.applicantStatus = response["status"];
     }
   );
  }

  populateApplicants(response: any ) {
      let applications: Application[] = response;
      let listApplicants : User[] = [];
      let appInd = 0;
      for (let app of applications) {
        this.commonService.checkAppicationBeforeDisplay(app, this.classname);
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

  getClientData() {
    this.iamService.getUserByUserId(this.jobListing.authorId).subscribe(response => {
      console.log(response);
      let clientDesc = "";
      if(response && response["aboutMeClient"] && response["aboutMeClient"] !== ""){
          clientDesc = response["aboutMeClient"];
      }
      this.commonService.checkIfString(clientDesc, "client description", this.classname);
      this.aboutClient = clientDesc;

    });
  }

  isThereClientDesc() {
      return "" !== this.aboutClient;
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
  isThereApplicants(){
    return this.applicants.length > 0;
  }
  hasApplicantApplied() {
    return this.applicantStatus !== "";
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
  // onSelectRating(rating:string){
  //   this.selectedRating=rating;
  // }
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
      this.getJobDetails(this.id);
      this.modalService.dismissAll();
    }
    );
  }

  setApplicantsStatus(status: String, applicantId: number) {
    let validStats = true;
    let updateDone = 0;
    if (status === "ACC") {
      status = JobAppsStatusEnum.ACC;

      this.jobListingService.updateJobStatus('PC', this.jobListing.id).subscribe(response => {
        console.log(response);
        updateDone = updateDone + 1;
        this.updatePageAfterApplicantionProcess(status, updateDone);
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
        updateDone = updateDone + 1;
        this.updatePageAfterApplicantionProcess(status, updateDone);
      }
      );
    }

  }
  updatePageAfterApplicantionProcess(status: String, updateDone: number) {

      if(status === JobAppsStatusEnum.REJ) {
        this.getApplicants(this.id);
      }
      else {
        if(updateDone > 1) {
          this.getJobDetails(this.id);
        }
      }
      this.modalService.dismissAll();
  }

  deleteJob() {
    this.jobListingService.updateJobStatus('R', this.jobListing.id).subscribe(response => {
      console.log(response);
      this.getJobDetails(this.id);
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
