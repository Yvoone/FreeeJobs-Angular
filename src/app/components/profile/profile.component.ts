import { Component, OnInit } from '@angular/core';
import { JobListing } from 'src/app/entities/job-listing';
import { User } from 'src/app/entities/user';
import { Rating } from 'src/app/entities/rating';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileType!: string;
  profileTitle!: string;
  jobSecTitle!: string;

  //hard coded examples START
  imagePath = './assets/img/default.png';
  professionalTitle = "Software Engineer";

  user: User = {
    id: 1,
    password: "",
    firstName: "Jackson",
    lastName: "Wang",
    email: "js@example.com",
    contactNo: "99999999",
    gender: "male",
    dob: "",
    aboutMe: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    skills: "Java, HTML, Python, Angular",
    linkedInAcct: ""
  };

  jobListings: JobListing[] = [
    {
      id: 1,
      authorId: 1,
      title: 'Urgently need UI/UX developer',
      details: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
      rate: '$50',
      rateType: '/hour',
      status: 'Completed',
      dateCreated: new Date()
    },
    {
      id: 1,
      authorId: 1,
      title: 'Urgentlyy need UI/UX developer',
      details: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
      rate: '$50',
      rateType: '/hour',
      status: 'Completed',
      dateCreated: new Date()
    }
  ];

  ratings: Rating[] = [
    {
      id: 1,
      jobId: 1,
      applicantId: 1,
      reviewTitle: 'Job done properly',
      review: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
      ratingScale: 3
    },
    {
      id: 2,
      jobId: 2,
      applicantId: 2,
      reviewTitle: "Best freelancer in town!",
      review: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
      ratingScale: 5
    },
    {
      id: 3,
      jobId: 3,
      applicantId: 3,
      reviewTitle: "Thank you for your service",
      review: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon official aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.',
      ratingScale: 4
    }
  ];

  //hard coded examples END

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.profileType == 'client') {
      this.jobSecTitle = "Job Listing";
      this.profileTitle = 'Client Profile';
    } else {
      this.jobSecTitle = "Job History";
      this.profileTitle = 'Freelancer Profile';
    }
  }

  openListing(listingUrl: String) {
    console.log("open listing called" + listingUrl);
    let source = window.location.origin;
    console.log("source: " + source)
    this.router.navigate([listingUrl]);
  }

}
