import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobListing } from 'src/app/entities/job-listing';
import { User } from 'src/app/entities/user';
import { JobListingService } from 'src/app/services/job-listing.service';

@Component({
  selector: 'app-job-listing-details',
  templateUrl: './job-listing-details.component.html',
  styleUrls: ['./job-listing-details.component.css']
})
export class JobListingDetailsComponent implements OnInit {

  id!: number;
  jobListing!: JobListing;
  applicants: User[] = [
    {
      id: 1,
    password: "",
    firstName: "David",
    lastName: "Lee",
    email: "davidlee@gmail.com",
    contactNo: "99999999",
    gender: "male",
    dob: "01 Janurary 1999",
    aboutMe: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    skills: "java, html, guitar",
    linkedInAcct: "abc"
    },
    {
      id: 2,
    password: "",
    firstName: "July",
    lastName: "Lee",
    email: "julylee@gmail.com",
    contactNo: "99999999",
    gender: "female",
    dob: "01 Janurary 1999",
    aboutMe: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    skills: "java, c+, guitar",
    linkedInAcct: "efg"
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private jobListingService: JobListingService
  ) {}

  ngOnInit(): void {
    console.log("open listing details");
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getJobDetails(this.id);
  }

  getJobDetails(id: number) {
    this.jobListingService.getJobListingById(id).subscribe(response => {
        this.jobListing = response;
      }
    );
  }

}
