import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobListing } from 'src/app/entities/job-listing';
import { User } from 'src/app/entities/user';
import { JobListingService } from 'src/app/services/job-listing.service';
import { JobApplicationService } from 'src/app/services/job-application.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Application } from 'src/app/entities/application';
import { IAMService } from 'src/app/services/iam.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private jobListingService: JobListingService,
    private modalService: NgbModal,
    private jobApplicationService: JobApplicationService,
    private iamService: IAMService
  ) {}

  ngOnInit(): void {
    console.log("open listing details");
    //Temp hardcoded
    this.userType = 0;
    this.userId = 5;

    this.id = this.activatedRoute.snapshot.params['id'];
    this.getJobDetails(this.id);
    this.getApplicants(this.id);
  }

  getJobDetails(id: number) {
    this.jobListingService.getJobListingById(id).subscribe(response => {
        this.jobListing = response;
      }
    );
  }

  showPopUp(content:any, applicantId: number) {
    console.log(this.applicants);
    this.modalService.open(content, {centered: true });
    if (applicantId > 0) {
      let appValue = this.applicantMap.get(applicantId);

      this.selectedUser = this.applicants[appValue["index"]];
      this.selectedDesc = appValue["desc"];
    }
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
    );
  }

}
