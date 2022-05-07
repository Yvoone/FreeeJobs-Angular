import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
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
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { ErrorMessageEnum } from 'src/app/models/error-message-enum';
import { AlertService } from "../../services/alert.service";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  profileUserId!: any;
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
  pdfUrl!:any;
  selectedFile!: File;
  selectedPDFFile!: File;
  selectedImageName!: string;
  selectedPDFName!:string;
  showImage!:string;
  showPDF!: string;
  alert!: string;

  classname: string = ProfileComponent.name;

  contactNumberRegEx = /^(?:\+65)?[689][0-9]{7}$/;

  @ViewChild('inputFile')
  myInputVariable!: ElementRef;
  @ViewChild('inputPDFFile')
  myInputPDF!: ElementRef;

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
    private sessionStorageService: SessionStorageService,
    private commonService: CommonService,
    private loggerService: LogService,
    private alertService: AlertService,) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  
  ngOnInit(): void {
    this.profileUserId = this.getProfileUserId();
    this.getCurrentUserDetails(this.profileUserId);
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

  profileUrl = ["/applicantProfile", "/profile"];
  editable!: boolean;

  getProfileUserId(): any {
    let userId;

    //Added by John
    // console.log("LoggedUserId", this.sessionStorageService.getSessionStorage('id'));
    // console.log("viewApplicantId", this.sessionStorageService.getSessionStorage('applicantProfileId'));
    
    if ( this.router.url == this.profileUrl[0]){
      userId = this.sessionStorageService.getSessionStorage('applicantProfileId');
      this.editable = false;
    } else if (this.router.url == this.profileUrl[1]){
      userId = this.sessionStorageService.getSessionStorage('id');
      this.editable = true;
    }
    // console.log("applicantProfileId",this.sessionStorageService.getSessionStorage('applicantProfileId'));
    // console.log("id",this.sessionStorageService.getSessionStorage('id'));
    //End here
    if (userId == null) {
      this.loggerService.error(ErrorMessageEnum.emptyUserId, this.classname);
      this.router.navigate(["/accessDenied"]);
    }else{
      return userId;
    }
  }

  //Added by John
  // @HostListener('window:beforeunload')
  // doSomethingBe() {
  //   console.log("HostListener");
  //   this.sessionStorageService.removeSessionStorage('applicantProfileId');
  // } // do right before leaving this component
  
  ngOnDestroy(): void {
    // this.sessionStorageService.removeSessionStorage('applicantProfileId');
  }
  //End here

  getCurrentUserDetails(id: number) {
    this.iamService.getUserProfileWithEmailByUserId(id).subscribe(response => {
      this.commonService.checkUserInfoBeforeDisplay(response, this.classname);
      this.user = response;
      let dateOfBirth = new Date(this.user.dob)  // added by John
      // TO DO pic/CV get from backend
      console.log(this.user.profilePicUrl);
      this.showImage = 'https://freeejobs-iam.s3.ap-southeast-1.amazonaws.com/'+this.sessionStorageService.getSessionStorage('id') + '.jpg';
      console.log(this.showImage)

      this.showPDF = 'https://freeejobs-iam.s3.ap-southeast-1.amazonaws.com/'+this.sessionStorageService.getSessionStorage('id') + '.pdf';

      this.editProfileForm.patchValue({
        'firstName': this.user.firstName,
        'lastName': this.user.lastName,
        'dateOfBirth': dateOfBirth,  // modified by John
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
      // console.log(response);

      let applications: Application[] = response;
      let completedJobs: JobListing[] = [];
      for (let appln of applications) {
        this.jobListingService.getCompletedJobListingById(appln.jobId).subscribe(response => {
          // console.log(response);
          if (response) {
            response.status = Object.entries(JobListingStatusEnum).find(([key, val]) => key === response.status)?.[1] || '';
            this.commonService.checkJobListingBeforeDisplay(response.title, response.details, response.rate, response.status, response.id, this.classname);
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
      // console.log(response);
      this.jobListings = response;
      this.jobListings.forEach((element) => {
        element.status = Object.entries(JobListingStatusEnum).find(([key, val]) => key === element.status)?.[1] || '';
        this.commonService.checkJobListingBeforeDisplay(element.title, element.details, element.rate, element.status, element.id, this.classname);
      });
      this.displayJobListings = this.jobListings;
    }
    );
  }

  noCount: number = 0;
  total_avg: number = 0;
  getFreelancerRatings(userId: number) {
    let allRatings = [];
    let sum = 0;
    let count = 0;
    let tmpFreelancerRatings: Rating[] = [];

    this.ratingService.getRatingsByTargetId(userId).subscribe(response => {
      // console.log(response);
      allRatings = response;
      // console.log(allRatings.length);

      sum = 0;
      count = 0;

      allRatings.forEach((e, index) => {
        this.commonService.checkRatingBeforeDisplay(e, this.classname);
        this.jobListingService.getJobListingById(e.jobId).subscribe(JobListing => {
          // console.log(JobListing);
          if (JobListing.authorId != e.targetId) {
            tmpFreelancerRatings.push(e);
            count = count + 1;
            sum = e.ratingScale + sum;
          }

          this.total_avg = sum / count;
          this.avgRating = this.total_avg.toFixed(1) + "/5.0";
          // this.noCount = count;
          this.reviewCount = count;
        });
        //To display
        this.freelancerRatings = tmpFreelancerRatings;
        this.displayRatings = this.freelancerRatings;
      });
    });
  }

  getClientRatings(userId: number) {
    this.ratingService.getRatingsByTargetId(userId).subscribe(response => {
      // console.log(response);
      let allRatings: Rating[] = response;
      let tmpClientRatings: Rating[] = [];
      let ratingCount = 0;

      let sum = 0;
      let count = 0;

      allRatings.forEach(e => {
        this.commonService.checkRatingBeforeDisplay(e, this.classname);
        this.jobListingService.getJobListingById(e.jobId).subscribe(Joblisting => {
          if (Joblisting.authorId == e.targetId) {
            tmpClientRatings.push(e);
            count = count + 1;
            sum = e.ratingScale + sum;
          }
          this.total_avg = (sum / count);
          this.avgRating = this.total_avg.toFixed(1) + "/5.0";
          this.reviewCount = count;
        })
        this.clientRatings = tmpClientRatings;
        this.displayRatings = this.clientRatings;
      });
      // console.log(tmpClientRatings)
    });
  }

  openListing(listingUrl: String) {
    // console.log("open listing called" + listingUrl);
    let source = window.location.origin;
    // console.log("source: " + source)
    this.router.navigate([listingUrl]);
  }

  editProfileClicked() {
    this.edit = true;
    this.url = '';
    this.pdfUrl = '';
    this.uploadImagePending = false;
    this.uploadPDFPending = false;
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
    this.getJobListingByOwner(this.profileUserId);
    this.getClientRatings(this.profileUserId);
  }

  switchToFreelancerProfile() {
    this.clientProfile = false;
    this.profileTitle = "Freelancer Profile";
    this.jobSecTitle = "Job History";
    this.aboutMeTitle = "About Me";
    this.getJobHistory(this.profileUserId);
    this.getFreelancerRatings(this.profileUserId);
  }

  switchProfile() {
    this.total_avg = 0;
    this.noCount = 0;
    if (this.clientProfile == false) {
      this.switchToClientProfile();
    } else if (this.clientProfile == true) {
      this.switchToFreelancerProfile();
    }
  }

  cancel() {
    this.edit = false;
  }

  uploadImagePending: boolean = false;
  //Gets called when the user selects an image
  public onFileChanged(event: any) {
    // console.log(event)
    //Select File
    this.selectedFile = event.target.files[0];
    // this.selectedImageName = event.target.files[0].name;
    this.selectedImageName = this.sessionStorageService.getSessionStorage('id') + '.jpg';
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
      this.uploadImagePending = true;
      // this.showImage = this.url
    } else {
      this.uploadImagePending = false;
    }
  }

  uploadPDFPending: boolean = false;
  uploadedPDFName: string = '';
  public onPDFChanged(event:any) {
    console.log(event)
    this.selectedPDFFile = event.target.files[0];
    this.selectedPDFName = this.sessionStorageService.getSessionStorage('id') + '.pdf';
    if (event.target.files && event.target.files[0]) {
      console.log('got PDF')
      var reader = new FileReader();
      this.uploadedPDFName = event.target.files[0].name;
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.pdfUrl = event.target.result;
      }
      this.uploadPDFPending = true;
    } else {
      this.uploadedPDFName = '';
      this.pdfUrl = ''
      console.log('no PFD')
      this.uploadPDFPending = false;
    }
  }

  removeImage(type:string) {
    if(type == 'image') {
      console.log(document.getElementById('imgPreview'))
      document.getElementById('imgPreview')!.removeAttribute('src');
      console.log(this.myInputVariable)
      this.myInputVariable.nativeElement.value = ''; // clear uploaded image
      this.url = null;
    } else if(type == 'PDF') {
      console.log("Delete Pending Upload-PDF")
      console.log(document.getElementById('pdfPreview'))
      document.getElementById('pdfPreview')!.removeAttribute('src');
      console.log(this.myInputPDF)
      this.myInputPDF.nativeElement.value = '';
      this.pdfUrl = null;
    }

  }


  firstName_valid:boolean = true;
  lastName_valid:boolean = true;
  nameRegex = /^[a-zA-Z0-9]+$/;
  email_valid:boolean = true;
  emailRegEx = /^(([^<>()[\]\\.,;:\s@!\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]{2,}\.)+[a-zA-Z]{2,}))$/;
  email_regex = new RegExp(this.emailRegEx);
  contactNumber_valid:boolean = true;
  contactNumber_regex = new RegExp(this.contactNumberRegEx);
  
  submit() {
    if (this.edit) {
      this.firstName_valid = this.nameRegex.test(this.editProfileForm.value.firstName);
      this.lastName_valid =  this.nameRegex.test(this.editProfileForm.value.lastName);
      this.email_valid = this.email_regex.test(this.editProfileForm.value.emailAddress);
      this.contactNumber_valid = this.contactNumber_regex.test(this.editProfileForm.value.contactNo);

      if(this.firstName_valid && this.lastName_valid && this.email_valid && this.contactNumber_valid){
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
          window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
          });
          this.alert = "Profile Updated Successfully!";
          this.alertService.success('Save Successfully', true);
        })

        if(this.uploadImagePending) {
          const uploadImageData = new FormData();
          uploadImageData.append('imageFile', this.selectedFile, this.selectedImageName)
          this.iamService.uploadImage(uploadImageData).subscribe((result) => {
            if(result!="Failed"){
              this.alertService.success('Save Successfully', true);
            }else{
              this.alertService.error('Failed To Upload, Please Try Again', true);
            }
            
          })
        }

        if(this.uploadPDFPending) {
          const uploadPDFData = new FormData();
          uploadPDFData.append('imageFile', this.selectedPDFFile, this.selectedPDFName)
          this.iamService.uploadImage(uploadPDFData).subscribe((result) => {
            if(result!="Failed"){
              this.alertService.success('Save Successfully', true);
            }else{
              this.alertService.error('Failed To Upload, Please Try Again', true);
            }
          })
        }

      } else {
        if(!this.contactNumber_valid) {
          this.alertService.error('Contact Number is not Valided. 8 Digit Valid SG Phone Number.', true);
        } else if (!this.email_valid) {
          this.alertService.error('Email is not valided. xx@xx.com', true);
        } else if (!this.firstName_valid) {
          this.alertService.error('First Name cannot be empty.', true);
        } else if (!this.lastName_valid) {
          this.alertService.error('last Name cannot be empty.', true);
        } 
       
        window.scroll({ 
          top: 0, 
          left: 0, 
          behavior: 'smooth' 
        });
      }


    }
    
    // setTimeout(() => {
    //   this.refresh();
    // }, 1000);
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
