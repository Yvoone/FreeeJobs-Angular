import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JobListing } from 'src/app/entities/job-listing';
import { JobListingService } from 'src/app/services/job-listing.service';
import { Application } from 'src/app/entities/application';
import { JobApplicationService } from 'src/app/services/job-application.service';
import { User } from 'src/app/entities/user';
import { IAMService } from 'src/app/services/iam.service';
import { Rating } from 'src/app/entities/rating';
import { RatingService } from 'src/app/services/rating.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { JobListingStatusEnum } from 'src/app/models/job-listing-status-enum';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  loggedInUserId!: any;
  user!: User;
  jobHistory: JobListing[] = [];
  jobListings: JobListing[] = [];
  displayJobListings: JobListing[] = [];
  displayRatings: Rating[] = [];
  clientRatings: Rating[] = [];
  freelancerRatings: Rating[] = [];

  profileTitle!: string;
  jobSecTitle!: string;
  aboutMeTitle!: string;
  edit = false;
  clientProfile = false;
  editProfileForm!: FormGroup;
  avgRating!: string;
  reviewCount!: number;
  clientAvgRating!: string;
  clientReviewCount!: number;
  freelancerAvgRating!: string;
  freelancerReviewCount!: number;
  url!: any;
  selectedFile!: File;
  alert!: string;

  contactNumberRegEx = /^[689]\d{7}$/;

  @ViewChild('inputFile')
  myInputVariable!: ElementRef;

  //hard coded
  imagePath = './assets/img/default.png';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private iamService: IAMService,
    private jobListingService: JobListingService,
    private jobApplicationService: JobApplicationService,
    private ratingService: RatingService,
    private sessionStorageService: SessionStorageService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.loggedInUserId = this.getLoggedInUserId();
    this.getCurrentUserDetails(this.loggedInUserId);
    this.initiateProfile();

    this.editProfileForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      contactNo: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(this.contactNumberRegEx)]],
      emailAddress: ['', [Validators.required]],
      professionalTitle: ['', [Validators.required]],
      aboutMe: ['', [Validators.required]],
      aboutMeClient: ['', [Validators.required]],
      skills: ['', [Validators.required]]
    });
  }

  getLoggedInUserId(): any {
    let userId = this.sessionStorageService.getID('id');
    if (userId == null) {
      //TODO throw error say no userId
    } else {
      return userId;
    }
  }

  getCurrentUserDetails(id: number) {
    this.iamService.getUserProfileWithEmailByUserId(id).subscribe(response => {
      this.user = response;

      this.editProfileForm.patchValue({
        'firstName': this.user.firstName,
        'lastName': this.user.lastName,
        'dateOfBirth': this.user.dob,
        'contactNo': this.user.contactNo,
        'emailAddress': this.user.email,
        'professionalTitle': this.user.professionalTitle,
        'aboutMe': this.user.aboutMe,
        'aboutMeClient': this.user.aboutMeClient,
        'skills': this.user.skills
      });
    }
    );
  }

  getJobHistory(applicantId: number) {
    this.jobApplicationService.getAcceptedApplicationsByApplicantId(applicantId).subscribe(response => {
      console.log(response);

      let applications: Application[] = response;
      let completedJobs: JobListing[] = [];
      for (let appln of applications) {
        this.jobListingService.getCompletedJobListingById(appln.jobId).subscribe(response => {
          console.log(response);
          if (response) {
            response.status = Object.entries(JobListingStatusEnum).find(([key, val]) => key === response.status)?.[1] || '';
            completedJobs.push(response);
          }
        }
        );
      }
      this.jobHistory = completedJobs;
      this.displayJobListings = this.jobHistory;
    }
    );
  }

  getJobListingByOwner(authorId: number) {
    this.jobListingService.getJobListingByUser(authorId).subscribe(response => {
      console.log(response);
      this.jobListings = response;
      this.jobListings.forEach((element) => {
        element.status = Object.entries(JobListingStatusEnum).find(([key, val]) => key === element.status)?.[1] || '';
      });
      this.displayJobListings = this.jobListings;
    }
    );
  }

  getClientRatings(userId: number) {
    this.ratingService.getRatingsByTargetId(userId).subscribe(response => {
      console.log(response);

      let allRatings: Rating[] = response;
      let tmpClientRatings: Rating[] = [];
      for (let rating of allRatings) {
        this.jobListingService.getJobListingById(rating.jobId).subscribe(response => {
          if (response.authorId == rating.targetId) {
            tmpClientRatings.push(rating);
          }
        }
        );
      }
      this.clientRatings = tmpClientRatings
      this.displayRatings = this.clientRatings;

      // if (this.displayRatings.length > 0) {
      //   const count = this.displayRatings.length;
      //   let sumRatings = 0;
      //   for (let rating of this.displayRatings) {
      //     sumRatings += rating.ratingScale;
      //   }
      //   this.clientAvgRating = (parseFloat((sumRatings / count).toString()).toFixed(1)) + "/5.0";
      //   this.clientReviewCount = count;
      // }
    });
  }

  getFreelancerRatings(userId: number) {
    this.ratingService.getRatingsByTargetId(userId).subscribe(response => {
      console.log(response);

      let allRatings: Rating[] = response;      
      let tmpFreelancerRatings: Rating[] = [];
      for (let rating of allRatings) {
        this.jobListingService.getJobListingById(rating.jobId).subscribe(response => {
          if (response.authorId != rating.targetId) {
            tmpFreelancerRatings.push(rating);
          }
        }
        );
      }

      this.freelancerRatings = tmpFreelancerRatings;
      this.displayRatings = this.freelancerRatings;

      // if (this.displayRatings.length > 0) {
      //   const count = this.displayRatings.length;
      //   let sumRatings = 0;
      //   for (let rating of this.displayRatings) {
      //     sumRatings += rating.ratingScale;
      //   }
      //   this.avgRating = (parseFloat((sumRatings / count).toString()).toFixed(1)) + "/5.0";
      //   this.reviewCount = count;
      // }
    });
  }

  openListing(listingUrl: String) {
    console.log("open listing called" + listingUrl);
    let source = window.location.origin;
    console.log("source: " + source)
    this.router.navigate([listingUrl]);
  }

  editProfileClicked() {
    this.edit = true;
  }

  initiateProfile() {
    if (this.clientProfile == false) {
      this.switchToFreelancerProfile();
    } else if (this.clientProfile == true) {
      this.switchToClientProfile();
    }
  }

  switchToClientProfile() {
    this.clientProfile = true;
    this.profileTitle = "Client Profile";
    this.jobSecTitle = "Job Listing";
    this.aboutMeTitle = "About Client";
    this.getJobListingByOwner(this.loggedInUserId);
    this.getClientRatings(this.loggedInUserId);
  }

  switchToFreelancerProfile() {
    this.clientProfile = false;
    this.profileTitle = "Freelancer Profile";
    this.jobSecTitle = "Job History";
    this.aboutMeTitle = "About Me";
    this.getJobHistory(this.loggedInUserId);
    this.getFreelancerRatings(this.loggedInUserId);
  }

  switchProfile() {
    if (this.clientProfile == false) {
      this.switchToClientProfile();
    } else if (this.clientProfile == true) {
      this.switchToFreelancerProfile();
    }
  }

  cancel() {
    this.edit = false;
  }

  //Gets called when the user selects an image
  public onFileChanged(event: any) {
    //Select File
    this.selectedFile = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }
  }

  removeImage() {
    document.getElementById('imgPreview')!.removeAttribute('src');
    this.myInputVariable.nativeElement.value = ''; // clear uploaded image
    this.url = null;
  }

  submit() {
    if (this.edit) {
      let editObj = {
        id: this.user.id,
        firstName: this.editProfileForm.value.firstName,
        lastName: this.editProfileForm.value.lastName,
        email: this.editProfileForm.value.emailAddress,
        contactNo: this.editProfileForm.value.contactNo,
        professionalTitle: this.editProfileForm.value.professionalTitle,
        aboutMe: this.editProfileForm.value.aboutMe,
        aboutMeClient: this.editProfileForm.value.aboutMeClient,
        skills: this.editProfileForm.value.skills,
      }

      this.iamService.updateUser(editObj).subscribe((result) => {
        this.alert = "Profile Updated Successfully!"
      })

    }
    this.refresh();
  }

  refresh() {
    location.reload();
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
