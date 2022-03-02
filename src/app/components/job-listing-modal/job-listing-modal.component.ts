import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobListing } from 'src/app/entities/job-listing';
import { User } from 'src/app/entities/user';
import { JobListingService } from 'src/app/services/job-listing.service';

@Component({
  selector: 'app-job-listing-modal',
  templateUrl: './job-listing-modal.component.html',
  styleUrls: ['./job-listing-modal.component.css']
})
export class JobListingModalComponent implements OnInit {

  @ViewChild('accessErrorModal') accessErrorModal: any;
  @ViewChild('successModal') successModal: any;

  modalType!: string;
  modalTitle!: string;

  editForm!: FormGroup;
  selectedRateType!: string;
  rateTypes: string[] = [];
  id!: number;
  url!: any;
  alertSuccess = false;
  successMessage!: string;
  updateFieldsMessage!: string;
  allRequiredFieldsEnteredMessage!: string;
  accessErrorMessage!: string;
  //user!: User;
  message!: string;

  jobListing!: JobListing;
  originalJobListing!: JobListing;

  //hardcode user
  user : User = {
    id: 5,
    password: "",
    firstName: "David",
    lastName: "Lee",
    email: "davidlee@gmail.com",
    contactNo: "99999999",
    gender: "male",
    dob: "01 Janurary 1999",
    aboutMe: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    skills: "java, html, guitar",
    linkedInAcct: "abc",
    professionalTitle: "",
    aboutMeClient: "",
  };
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private jobListingService: JobListingService,
    private formBuilder: FormBuilder,
    private modal: NgbModal) { }

  ngOnInit(): void {
    this.modalType = this.activatedRoute.snapshot.params['type'];
    this.rateTypes= ['Per Hour', 'Per Job'];
    this.editForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      details: ['', [Validators.required]],
      rate: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
    if(this.modalType=='edit'){
      this.id = this.activatedRoute.snapshot.params['id'];
      this.modalTitle='Edit';
      this.getJobDetails(this.id);
    }else{
      this.modalTitle='Create';
      this.selectedRateType=this.rateTypes[0];
    }
    
    
  }

  get getEditFormControl() {
    return this.editForm.controls;
  }

  onSelect(rateType: string) {
    console.log(rateType);
    this.selectedRateType = rateType;
  }

  getJobDetails(id: number) {
    this.jobListingService.getJobListingById(id).subscribe(response => {
        this.originalJobListing = response;
        //check if author of joblisting is user
        if(this.user.id!=this.originalJobListing.authorId){
          this.modal.open(this.accessErrorModal)
          this.accessErrorMessage = "You are not allowed to edit another user's job listing.";
          //return to previous page
          
        }else{
          this.setJobDetails(response);
        }
      }
    );
    
  }

  setJobDetails(jobListing: JobListing){
    this.editForm.patchValue({
      title: jobListing.title,
      details: jobListing.details,
      rate: jobListing.rate
    })
    //this.selectedRateType = this.rateTypes[Number(jobListing.rateType)];
    this.selectedRateType = this.rateTypes[Number("1")];
    
  }

  submit() {
    if(this.modalType=='edit'){
      let editObj = {
        id: this.originalJobListing.id,
        title: this.editForm.value.title,
        details: this.editForm.value.details,
        rate: this.editForm.value.rate,
        rateType: this.selectedRateType,
        authorId: this.originalJobListing.authorId
      }
      //check if form edited
      if (editObj.title != this.originalJobListing.title || editObj.details != this.originalJobListing.details
        || editObj.rate != this.originalJobListing.rate || editObj.rateType != this.originalJobListing.rateType) {

        this.jobListingService.updateListing(editObj).subscribe((result) => {
          //handle error
          //go back to actual listing once updated? whats next step
          this.successMessage = "Update Listing Success!"
          setTimeout(() => {
            this.successMessage = "";
          }, 3000);

        })

      } else {
        this.updateFieldsMessage = "Please update at least one field."
        // this.updateFieldsSuccess = true;

        setTimeout(() => {
          this.updateFieldsMessage = "";
        }, 2500);

        console.log("went through update field")
      }
    } else{
      let editObj = {
        title: this.editForm.value.title,
        details: this.editForm.value.details,
        rate: this.editForm.value.rate,
        rateType: this.selectedRateType,
        authorId: this.user.id
      }
      this.jobListingService.create(editObj).subscribe((result) => {
        this.modal.open(this.successModal);
        this.successMessage = "Upload Listing Success!"
        setTimeout(() => {
          location.reload();
        }, 3000);
        
      });
    }
  }

  

}
