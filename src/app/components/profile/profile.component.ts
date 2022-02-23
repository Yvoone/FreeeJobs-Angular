import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JobListing } from 'src/app/entities/job-listing';
import { JobListingService } from 'src/app/services/job-listing.service';
import { User } from 'src/app/entities/user';
import { IAMService } from 'src/app/services/iam.service';
import { Rating } from 'src/app/entities/rating';
import { RatingService } from 'src/app/services/rating.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user!: User;
  jobListings: JobListing[] = [];
  ratings: Rating[] = [];

  profileType!: string;
  profileTitle!: string;
  jobSecTitle!: string;
  edit = false;
  editProfileForm!: FormGroup;
  url!: any;
  selectedFile!: File;

  @ViewChild('inputFile')
  myInputVariable!: ElementRef;

  //hard coded examples START
  imagePath = './assets/img/default.png';

  // user: User = {
  //   id: 1,
  //   password: "",
  //   firstName: "Jackson",
  //   lastName: "Wang",
  //   email: "js@example.com",
  //   contactNo: "99999999",
  //   gender: "male",
  //   dob: "",
  //   aboutMe: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  //   skills: "Java, HTML, Python, Angular",
  //   linkedInAcct: "",
  //      professionalTitle = "Software Engineer";
  // };

  // jobListings: JobListing[] = [
  //   {
  //     id: 1,
  //     authorId: 1,
  //     title: 'Urgently need UI/UX developer',
  //     details: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
  //     rate: '$50',
  //     rateType: '/hour',
  //     status: 'Completed',
  //     dateCreated: new Date()
  //   },
  //   {
  //     id: 1,
  //     authorId: 1,
  //     title: 'Urgentlyy need UI/UX developer',
  //     details: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
  //     rate: '$50',
  //     rateType: '/hour',
  //     status: 'Completed',
  //     dateCreated: new Date()
  //   }
  // ];

  // ratings: Rating[] = [
  //   {
  //     id: 1,
  //     jobId: 1,
  //     userId: 1,
  //     reviewTitle: 'Job done properly',
  //     review: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
  //     ratingScale: 3
  //   },
  //   {
  //     id: 2,
  //     jobId: 2,
  //     userId: 2,
  //     reviewTitle: "Best freelancer in town!",
  //     review: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
  //     ratingScale: 5
  //   },
  //   {
  //     id: 3,
  //     jobId: 3,
  //     userId: 3,
  //     reviewTitle: "Thank you for your service",
  //     review: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
  //     ratingScale: 4
  //   }
  // ];

  //hard coded examples END

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private iamService: IAMService,
    private jobListingService: JobListingService,
    private ratingService: RatingService) { }

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
    });
  }

  getCurrentUser(id: number) {
    this.iamService.getUserByUserId(id).subscribe(response => {
      this.user = response;
    }
    );
  }

  getJobHistory(authorId: number) {
    this.jobListingService.getJobListingByUser(authorId).subscribe(response => {
      console.log(response);

      let jobListings: JobListing[] = response;
      let completedJobs : JobListing[] = [];
      for (let job of jobListings) {
        if (job.status == 'Completed') {
          completedJobs.push(job);
        }
      }
      this.jobListings = completedJobs;
      }
    );
  }

  getRatings(userId: number) {
    this.ratingService.getRatingsByUserId(userId).subscribe(response => {
      console.log(response);
      this.ratings = response;
    })
  }


  openListing(listingUrl: String) {
    console.log("open listing called" + listingUrl);
    let source = window.location.origin;
    console.log("source: " + source)
    this.router.navigate([listingUrl]);
  }

  removeImage() {
    document.getElementById('imgPreview')!.removeAttribute('src');
    this.myInputVariable.nativeElement.value = ''; // clear uploaded image
    this.url = null;
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

}
