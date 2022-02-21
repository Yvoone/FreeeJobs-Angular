import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/entities/user';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { SessionStorageService } from "../../services/session-storage.service";
import { AuthService } from "../../services/auth.service";

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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    sessionStorage.clear();

    this.loginForm = this.formBuilder.group({

      email: ['', Validators.required],
      password: ['', Validators.required]
    });
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
      // this.authService.login(this.loginForm.value);   // {1}
      
      this.authService.login(this.control.email.value, this.control.password.value);
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
  checkSession(){
    this.loginemail = this.sessionStorageService.getEmail('email');
  }
  clearSession(){
    this.sessionStorageService.removeEmail('email');
  }

}
