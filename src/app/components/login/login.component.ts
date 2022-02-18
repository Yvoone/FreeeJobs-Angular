import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/entities/user';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";

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


  //////////////////////////////
  // form: FormGroup = new FormGroup({
  //   username: new FormControl(''),
  //   password: new FormControl(''),
  // });

  constructor(
    private router : Router,
    private titleService: Title,
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({

      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get username (){
    return this.loginForm.get('username');
  }
  get password (){
    return this.loginForm.get('password');
  }

  onSubmit(){
    this.control = this.loginForm.controls;
    console.log(this.loginForm)
    if (this.loginForm.valid) {
      this.submitted = true;
      this.submitEM.emit(this.loginForm.value);
    } else { 
      this.submitted = false;
    }
    console.log("submit?")
    let username = this.loginForm.get('username')?.value;
    console.log(username)
    let password = this.loginForm.get('password')?.value;
    
  }


}
