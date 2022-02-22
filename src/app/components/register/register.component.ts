import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from "../../services/auth.service";
import { IAMService } from "../../services/iam.service";
import { AlertService } from "../../services/alert.service";

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

  gender = [
    { value: 'male', viewValue: 'Male'},
    { value: 'female', viewValue: 'Female'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private IAMService: IAMService,
    private router: Router,
    private authenticationService: AuthService,
    private alertService: AlertService
    // private userService: UserService,
    // private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      contactNo: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      aboutMe: ['', Validators.required],
      skills: ['', Validators.required],
      linkedInAcct: ['', Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    console.log(this.registerForm.value)
    this.loading = true;

    this.control = this.registerForm.controls;
    this.email_require = this.control.email.errors
    this.pw_require = this.control.password.errors
    // this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log("false")
      this.loading = false;
      return;
    }
    console.log(this.registerForm.value);
    this.IAMService.registerUser(this.registerForm.value)
      .pipe(first())
      .subscribe(e =>{
        this.alertService.success('Registration Successful', true);
        console.log(e);
        this.router.navigate(['/login']);
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

}
