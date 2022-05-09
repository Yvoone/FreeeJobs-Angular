import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from "../../services/auth.service";
import { IAMService } from "../../services/iam.service";
import { AlertService } from "../../services/alert.service";
import { User } from "../../entities/user";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;

  @Output() submitEM = new EventEmitter();

  user_type: string = "client";

  submitted: boolean = false;
  control: any;
  user_touched: boolean = false;
  pw_touched: boolean = false;

  email_require!: boolean;
  pw_require!: boolean;
  fn_require!: boolean;
  ln_require!: boolean;
  no_require!: boolean;
  gender_require!: string;
  dob_require!: boolean;
  role_require!:boolean;
  
  next:boolean = true;
  selected_client :boolean = false;
  selected_freelancer :boolean = false;

  gender = [
    { value: 'male', viewValue: 'Male'},
    { value: 'female', viewValue: 'Female'}
  ];

  role = [
    { value: 'client', viewValue: 'Client'},
    { value: 'freelancer', viewValue: 'Freelancer'},
    { value: 'both', viewValue: 'Client & Freelancer'}
  ];

  minDate!: Date;
  maxDate!: Date;

  user!: User;

  emailRegEx = /^(([^<>()[\]\\.,;:\s@!\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]{2,}\.)+[a-zA-Z]{2,}))$/;
  pwRegEx = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}/;
  // contactNumberRegEx = /^[689]\d{7}$/;^(?:\+65)?[689][0-9]{7}$;
  contactNumberRegEx = /^(?:\+65)?[689][0-9]{7}$/;


  constructor(
    private formBuilder: FormBuilder,
    private IAMService: IAMService,
    private router: Router,
    private authenticationService: AuthService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    // private userService: UserService,
    // private alertService: AlertService
  ) { 
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date
  }
  linkedInAuth='';
  string_email: any;
  linkedIn_id:any;
  linkedIn_userEmail: any;
  linkedIn_firstName:any;
  linkedIn_lastName:any;
  number1_email:any;
  number2_email:any;
  // string3 = '{"handle~":{"emailAddress":"freeejob4@gmail.com"},"handle":"urn:li:emailAddress:8371471861"}'
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailRegEx)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.pwRegEx)]],
      contactNo: ['', [Validators.required, Validators.pattern(this.contactNumberRegEx)]],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      // userRole: ['', Validators.required],
      // aboutMe: ['', Validators.required],
      // skills: ['', Validators.required],
      // linkedInAcct: ['', Validators.required]
      aboutMe: ['', Validators.maxLength(200)],
      aboutMeClient: ['', Validators.maxLength(200)],
      skills: ['', Validators.maxLength(200)],
      professionalTitle: [''],
      linkedInAcct: [''],
      profilePicUrl: ['']
    });

    this.linkedInAuth = this.route.snapshot.queryParams["code"];
    console.log(this.linkedInAuth)
    console.log(this.route.snapshot.queryParams)
    if(this.linkedInAuth && this.linkedInAuth != ''){
      console.log(this.linkedInAuth)
      this.IAMService.getLinkedInAccess(this.linkedInAuth).subscribe(response => {
        console.log(response)
        if(response.access_token) {
          this.IAMService.getLinkedInProfileName(response.access_token).subscribe(data => {
            console.log(data)
            console.log(data.id)
            console.log(data.localizedLastName)
            console.log(data.localizedFirstName)
            this.linkedIn_id = data.id;
            this.linkedIn_lastName = data.localizedLastName;
            this.linkedIn_firstName = data.localizedFirstName;

            // this.user.firstName = this.linkedIn_firstName;
            // this.user.lastName = this.linkedIn_lastName;
            // this.user.linkedInAcct = this.linkedIn_id;

            this.IAMService.registerLinkedInUser(this.linkedIn_firstName, this.linkedIn_lastName, this.linkedIn_id)
              .pipe(first())
              .subscribe(e =>{
                this.alertService.success('Registration Successful', true);
                console.log(e);
                this.router.navigate(['/login']);
            });
          })
          this.IAMService.getLinkedInProfileEmail(response.access_token).subscribe(email => {
            console.log(email)
            console.log(email.elements)
            this.string_email = JSON.stringify(email.elements[0])
            this.number1_email = this.string_email.indexOf('Address":"') +10;
            console.log(this.string_email.indexOf('"},"handle"'))
            this.number2_email = this.string_email.indexOf('"},"handle"')
            console.log(this.string_email.substring(this.number1_email, this.number2_email))
            this.linkedIn_userEmail = this.string_email.substring(this.number1_email, this.number2_email);

          })
          this.IAMService.getLinkedInProfilePictrue(response.access_token).subscribe(pic => {
            console.log(pic)
            // console.log(pic.displayImage.elements[3].identifiers[0].identifier)

          })
          
          setTimeout(() => {                    //To check is it succussful registered
            
          }, 1000);
        }
      })
    } else {
      console.log("undefined")
    }
  }

  linkedInCredentials = {
    clientId: "86dyp3ax33yxnv",
    redirectUrl: "https://freeejobs-web.herokuapp.com/register",
    scope: "r_liteprofile%20r_emailaddress%20w_member_social" // To read basic user profile data and email
  }

  linkedin(){
    window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
      this.linkedInCredentials.clientId
    }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=${this.linkedInCredentials.scope}`;
  }

  get f() { return this.registerForm.controls; }

  contact_no: any;
  contactNo_validation?: boolean;
  checktextcontent(){
    // console.log(this.contact_no?.length)
    if(this.contact_no?.length >= 8){
      this.contactNo_validation = this.contactNumberRegEx.test(this.contact_no);
    }
    // console.log(this.contactNo_validation)
  }

  onSubmit() {
    // console.log(this.registerForm.value)
    // console.log(this.registerForm.controls)
    this.loading = true;

    this.control = this.registerForm.controls;
    this.email_require = this.control.email.errors;
    this.pw_require = this.control.password.errors;
    this.fn_require = this.control.firstName.errors;
    this.ln_require = this.control.lastName.errors;
    this.no_require = this.control.contactNo.errors;
    this.gender_require = this.control.gender.status;
    this.dob_require = this.control.dob.errors;
    // this.role_require = this.control.userRole.status;
    // this.submitted = true;

    console.log(this.control.dob.value);
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log("false")
      this.loading = false;
      return;
    }
    // console.log(this.registerForm.value);
    this.user = this.registerForm.value
    this.user.profilePicUrl = './assets/img/default.png';
    console.log(this.user)
    this.IAMService.registerUser(this.user)
      .pipe(first())
      .subscribe(e =>{
        this.alertService.success('Registration Successful', true);
        console.log(e);
        this.router.navigate(['/login']);

        // setTimeout(() => {                    //To check is it succussful registered
        // this.router.navigate(['/login']);
        // }, 1500);

      });
    // this.router.navigate(['/login']);
    // this.loading = true;
    // this.userService.register(this.registerForm.value)
    //     .pipe(first())
    //     .subscribe(
    //         data => {
    //             this.alertService.success('Registration successful', true);
    //             this.router.navigate(['/login']);
    //         },
    //         error => {
    //             this.alertService.error(error);
    //             this.loading = false;
    //         });
  }

  // nextPage(action:string){
  //   if (action == "next"){
  //     if( this.email_require == false &&
  //         this.pw_require == false && 
  //         this.fn_require == false &&
  //         this.ln_require == false &&
  //         this.no_require == false &&
  //         this.gender_require == "VALID" &&
  //         this.dob_require == false ){
  //           this.next = !this.next;
  //         } else {
  //           this.alertService.error('Please fill up the blanks', true);
  //         }
  //   } else if (action == "previous"){
  //     this.next = !this.next;
  //   }
  // }

  nextPage(action:string){
    if (action == "next"){
    
            this.next = !this.next;
          } 
     else if (action == "previous"){
      this.next = !this.next;
    }
  }
    
  selectRole(e:string){
    switch (e) {
      case "client":
        this.selected_client = true;
        this.selected_freelancer = false;
        break;
      case "freelancer":
        this.selected_freelancer = true;
        this.selected_client = false;
        break;
      case "both":
        this.selected_freelancer = true;
        this.selected_client = true;
        break;
      default:
        break;
    }
  }

}
