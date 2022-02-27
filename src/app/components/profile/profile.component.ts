import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JobListing } from 'src/app/entities/job-listing';
import { JobListingService } from 'src/app/services/job-listing.service';
import { User } from 'src/app/entities/user';
import { IAMService } from 'src/app/services/iam.service';
import { Rating } from 'src/app/entities/rating';
import { RatingService } from 'src/app/services/rating.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { JobListingStatusEnum } from 'src/app/models/job-listing-status-enum';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user!: User;
  jobHistory: JobListing[] = [];
  ratings: Rating[] = [];

  profileType!: string;
  profileTitle!: string;
  jobSecTitle!: string;
  edit = false;
  editProfileForm!: FormGroup;
  avgRating!: string;
  reviewCount!: number;
  url!: any;
  selectedFile!: File;
  alert!: string;

  contactNumberRegEx = /^[689]\d{7}$/;

  @ViewChild('inputFile')
  myInputVariable!: ElementRef;

  //hard coded
  imagePath = './assets/img/default.png';

  // constructor(private route: ActivatedRoute, private router: Router) {
  //   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  // }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private iamService: IAMService,
    private jobListingService: JobListingService,
    private ratingService: RatingService) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     }

  ngOnInit(): void {
    if (this.profileType == 'client') {
      this.jobSecTitle = "Job Listing";
      this.profileTitle = 'Client Profile';
      this.getCurrentUser(3);
    } else {
      this.jobSecTitle = "Job History";
      this.profileTitle = 'Freelancer Profile';
      this.getCurrentUser(3);
    }

    this.getJobHistory(1);
    this.getRatings(3);

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
      skills: ['', [Validators.required]]
    });
  }

  getCurrentUser(id: number) {
    this.iamService.getUserByUserId(id).subscribe(response => {
      this.user = response;
      
      this.editProfileForm.patchValue({
        'firstName': this.user.firstName,
        'lastName': this.user.lastName,
        'dateOfBirth': this.user.dob,
        'contactNo': this.user.contactNo,
        // 'emailAddress': this.user.email,
        'professionalTitle': this.user.professionalTitle,
        'aboutMe': this.user.aboutMe,
        'skills': this.user.skills
      });
    }
    );
  }

  getJobHistory(authorId: number) {
    this.jobListingService.getJobListingByUser(authorId).subscribe(response => {
      console.log(response);

      let jobListings: JobListing[] = response;
      let completedJobs: JobListing[] = [];
      for (let job of jobListings) {
        if (job.status == 'Completed') {
          completedJobs.push(job);
        }
      }
      this.jobHistory = completedJobs;
    }
    );
  }

  getRatings(userId: number) {
    this.ratingService.getRatingsByTargetId(userId).subscribe(response => {
      console.log(response);

      let allRatings: Rating[] = response;
      if (allRatings.length > 0) {
        const count = allRatings.length;
        let sumRatings = 0;
        for (let rating of allRatings) {
          sumRatings += rating.ratingScale;
        }
        this.avgRating = (parseFloat((sumRatings / count).toString()).toFixed(1)) + "/5.0";
        this.reviewCount = count;
      } else {
        this.avgRating = "-";
        this.reviewCount = 0;
      }

      this.ratings = response;
    })
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
    if(this.edit){
      let editObj = {
        id: this.user.id,
        firstName: this.editProfileForm.value.firstName,
        lastName: this.editProfileForm.value.lastName,
        dob: this.editProfileForm.value.dateOfBirth,
        contactNo: this.editProfileForm.value.contactNo,
        professionalTitle: this.editProfileForm.value.professionalTitle,
        aboutMe: this.editProfileForm.value.aboutMe,
        skills: this.editProfileForm.value.skills
      }

      this.iamService.updateUser(editObj).subscribe((result) => {
        this.alert = "Profile Updated Successfully!"
      })

    }
    location.reload();
  }
}
