import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/entities/user';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { SessionStorageService } from "../../services/session-storage.service";
import { AuthService } from "../../services/auth.service";
import { IAMService } from "../../services/iam.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() error!: string | null;

  @Output() submitEM = new EventEmitter();

  loginForm!: FormGroup;
  user_type: string = "client";

  submitted: boolean = false;
  control: any;
  user_touched: boolean = false;
  pw_touched: boolean = false;

  email_require!: boolean;
  pw_require!: boolean;

  linkedInAuth = "";

  linkedIn_id:any;
  string_email: any;
  linkedIn_userEmail: any;
  number1_email:any;
  number2_email:any;

  //////////////////////////////
  // form: FormGroup = new FormGroup({
  //   email: new FormControl(''),
  //   password: new FormControl(''),
  // });

  constructor(
    private router : Router,
    private titleService: Title,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private IAMService: IAMService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
    sessionStorage.clear();

    this.loginForm = this.formBuilder.group({

      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.linkedInAuth = this.route.snapshot.queryParams["code"];
    console.log("linkedIn_Auth", this.linkedInAuth)

    if(this.linkedInAuth){
      // this.IAMService.linkedInLogin_test(this.linkedInAuth).subscribe(response => {
      //   console.log("1st", response)
      // })
      this.IAMService.linkedInLogin_test2(this.linkedInAuth).subscribe(response => {
        console.log("2nd",response)
        setTimeout(() => {
          console.log('coming here?', response)
          this.authService.linkedInLogin(response.data);
        }, 100);
      })
    }

    // if(this.linkedInAuth){
    //   console.log(this.linkedInAuth)
    //   this.IAMService.getLinkedInAccess_login(this.linkedInAuth).subscribe(response => {
    //     console.log(response)
    //     if(response.access_token) {
    //       this.IAMService.getLinkedInProfileName(response.access_token).subscribe(data => {
    //         console.log(data)
    //         console.log("idIDidIDIDid: ",data.id)
    //         console.log(data.localizedLastName)
    //         console.log(data.localizedFirstName)
    //         this.linkedIn_id = data.id;
    //         setTimeout(() => {
    //           console.log('coming here?', this.linkedIn_id)
    //           this.authService.linkedInLogin(this.linkedIn_id);
    //         }, 100);
    //       })
    //       this.IAMService.getLinkedInProfileEmail(response.access_token).subscribe(email => {
    //         console.log(email)
    //         console.log(email.elements)
    //         this.string_email = JSON.stringify(email.elements[0])
    //         this.number1_email = this.string_email.indexOf('Address":"') +10;
    //         console.log(this.string_email.indexOf('"},"handle"'))
    //         this.number2_email = this.string_email.indexOf('"},"handle"')
    //         console.log(this.string_email.substring(this.number1_email, this.number2_email))
    //         this.linkedIn_userEmail = this.string_email.substring(this.number1_email, this.number2_email);

    //       })
    //       this.IAMService.getLinkedInProfilePictrue(response.access_token).subscribe(pic => {
    //         console.log(pic)
    //         console.log(pic.displayImage.elements[3].identifiers[0].identifier)

    //       })

    //     }
    //   })
    // } else {
    //   console.log("undefined")
    // }
  }

  linkedInCredentials = {
    clientId: "86dyp3ax33yxnv",
    redirectUrl: "https://freeejobs-web.herokuapp.com/login",
    scope: "r_liteprofile%20r_emailaddress" // To read basic user profile data and email
  }

  linkedin(){
    window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
      this.linkedInCredentials.clientId
    }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=${this.linkedInCredentials.scope}`;
  }

  isFieldInvalid(field: string) { // {6}
    return (
      (!this.loginForm.get(field)!.valid && this.loginForm.get(field)!.touched) ||
      (this.loginForm.get(field)!.untouched && this.submitted)
    );
  }


  onSubmit(){
    this.control = this.loginForm.controls;
    this.email_require = this.control.email.errors
    this.pw_require = this.control.password.errors
    console.log(this.control)
    console.log(this.control.email.value)
    if (this.loginForm.valid) {
      console.log("submitted")
      this.submitted = true;

      this.authService.login(this.loginForm.value);   // {1}  Login with API
      // this.authService.login(this.control.email.value, this.control.password.value); // {1}  Login WITHOUT API

      this.submitEM.emit(this.loginForm.value);

      //store email or ID later
      // sessionStorage.clear();
      // this.sessionStorageService.setEmail('email', this.control.email.value);

      //navigete to other page
      // this.router.navigateByUrl("");

    } else {
      this.submitted = false;
      console.log("no submit")
    }
  }

  register(){
    console.log("register")
  }

  //check session storage
  loginemail!: string
  loginID!:string
  checkSession(){
    //this.loginemail = this.sessionStorageService.getEmail('email');
    this.loginemail = this.sessionStorageService.getSessionStorage('email');
    //this.loginID = this.sessionStorageService.getID('id');
    this.loginID = this.sessionStorageService.getSessionStorage('id');
  }
  clearSession(){
    //this.sessionStorageService.removeEmail('email');
    this.sessionStorageService.removeSessionStorage('email');
    //this.sessionStorageService.removeID('id');
    this.sessionStorageService.removeSessionStorage('id');
  }


  forget_Password!:string;
  forget_Password_msg!:string;
  forget_Password_msg_display:boolean=false;
  emailRegEx = /^(([^<>()[\]\\.,;:\s@!\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]{2,}\.)+[a-zA-Z]{2,}))$/;
  emailRegEx_format = new RegExp(this.emailRegEx)
  forgetPassword(content:any, requestId: number){
    this.modalService.open(content, {centered: true });
    // change to default password "1!Qazxcnm", then send email
  }
  
  sendRequest(e:any){
    console.log(this.emailRegEx_format.test(e))
    if(this.emailRegEx_format.test(e)) {
      console.log("Send Request Action", e)
      this.IAMService.forgetPassword(e).subscribe(response => {
          console.log(response)
      })
      this.forget_Password_msg = 'Correct Format';
      this.modalService.dismissAll();
      this.forget_Password = '';
    } else {
      this.forget_Password_msg_display = true;
      this.forget_Password_msg = 'Wrong Email Format, Please Input Again.'
    }
  }

}
