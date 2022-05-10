import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from "../../services/auth.service";
import { IAMService } from "../../services/iam.service";
import { AlertService } from "../../services/alert.service";
import { User } from "../../entities/user";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  registerForm!: FormGroup;
  emailRegEx = /^(([^<>()[\]\\.,;:\s@!\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]{2,}\.)+[a-zA-Z]{2,}))$/;
  pwRegEx = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}/;

  
  user!: User;

  loading = false;
  
  submitted: boolean = false;
  control: any;
  user_touched: boolean = false;
  pw_touched: boolean = false;

  email_require!: boolean;
  pw_require!: boolean;
  tempPassward_require!: boolean;

  email_api!:string;
  pw_api!:string;
  tempPassward_api!:string;
  
  next:boolean = true;
  selected_client :boolean = false;
  selected_freelancer :boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private IAMService: IAMService,
    private router: Router,
    private authenticationService: AuthService,
    private alertService: AlertService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      tempPassward: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailRegEx)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.pwRegEx)]],
    });
  }

  onSubmit() {
    // console.log(this.registerForm.value)
    // console.log(this.registerForm.controls)
    this.loading = true;

    this.control = this.registerForm.controls;
    this.email_require = this.control.email.errors;
    this.pw_require = this.control.password.errors;
    this.tempPassward_require = this.control.tempPassward.errors;
    // this.role_require = this.control.userRole.status;
    // this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        console.log("false")
        this.loading = false;
      return;
    }
    // console.log(this.registerForm.value);
    console.log(this.registerForm.value)
    this.email_api = this.registerForm.value.email;
    this.pw_api = this.registerForm.value.password;
    this.tempPassward_api = this.registerForm.value.tempPassward;
    console.log(this.email_api,this.pw_api,this.tempPassward_api)
    this.IAMService.changePassword(this.email_api, this.pw_api, this.tempPassward_api)
      .pipe(first())
      .subscribe(e =>{
        this.alertService.success('Submit Successful', true);
        console.log(e);
        this.router.navigate(['/login']);

        // setTimeout(() => {                    //To check is it succussful registered
        // this.router.navigate(['/login']);
        // }, 1500);

      });
  }

}
