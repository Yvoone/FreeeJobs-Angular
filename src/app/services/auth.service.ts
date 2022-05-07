import { Component, OnInit, Input, Output, EventEmitter, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { User } from "../entities/user";
import { SessionStorageService } from "../services/session-storage.service";
import {  BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IAMService } from "../services/iam.service";
import { AlertService } from "../services/alert.service";
import { LogService } from './log.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}
  currentLogin = this.loggedIn.asObservable();

  public loggedIn2 = new BehaviorSubject<any>(''); // {1}
  currentLogin2 = this.loggedIn2.asObservable();

  get isLoggedIn() {
    let email: any;
    //email= this.sessionStorageService.getEmail('email');
    email= this.sessionStorageService.getSessionStorage('email');
    let id:any;
    //id= this.sessionStorageService.getEmail('id');
    id= this.sessionStorageService.getSessionStorage('id');

    console.log(email)
    if (email && id) {
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false)
    }
    return this.loggedIn.asObservable(); // {2}
  }

  gettoken(){
    console.log(sessionStorage.getItem("id"))
    if(sessionStorage.getItem("id") !=null){
      return true;
    } else {
      return false;
    }
    // return !!sessionStorage.getItem("email");
  }


  constructor(
    private sessionStorageService: SessionStorageService,
    private IAMService: IAMService,
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService,
    private logService: LogService
  ) {}

  //Login with API
  login(user:User){
  // login(email: string, password: string){
    console.log("auth service login in")
    this.IAMService.login(user).subscribe(e=>{
      console.log(e)
      if (e.loginStatus == 1) {
        this.loggedIn.next(true);
        this.loggedIn2.next('loggin');
        sessionStorage.clear();
        console.log(this.sessionStorageService.getSessionStorage('email'));
        //this.sessionStorageService.setEmail('email', user.email);
        this.sessionStorageService.setSessionStorage('email', user.email);
        //this.sessionStorageService.setID('id', e.userId)
        this.sessionStorageService.setSessionStorage('id', e.userId);
        this.sessionStorageService.setSessionStorage('jobId', 0);
        setTimeout(() => {
          this.router.navigate(['/otp']);
        }, 100);
        this.IAMService.getSessionTimeout(Number(e.userId)).subscribe(e=>{
          this.sessionStorageService.setSessionStorage('sessionTimeout', new Date(e));
          console.log("sessiontimeout:"+sessionStorage.getItem("sessionTimeout"));
        });
        // this.router.navigateByUrl("")
      } else if(e.loginStatus == 0) {
        this.alertService.error('Login Fail', true);
      } else if(e.loginStatus == 2){
        console.log("login status == 2")
      } else if(e.loginStatus == 3){
        this.alertService.error('The Account is locked after 3 fail attempts. Please contact admin.', true)
      }
    });
  }

  // //Login WITHOUT API
  // login(email: string, password: string){
  //   console.log("auth service login in")
  //     if (email !== '' && password !== '' ) { // {3}

  //       this.loggedIn.next(true);
  //       this.loggedIn2.next('loggin');
  //       sessionStorage.clear();
  //       console.log(this.sessionStorageService.getEmail('email'));
  //       this.sessionStorageService.setEmail('email', email);
  //       this.router.navigate(['/dashboard']);
  //       // this.router.navigateByUrl("")
  //     } else {
  //       this.alertService.error('Login Fail', true);
  //     }
  // }

  logout() {                            // {4}
    console.log("logout?")
    this.loggedIn.next(false);
    sessionStorage.clear();
    //this.sessionStorageService.removeEmail('email');
    this.sessionStorageService.removeSessionStorage('email');
    //this.sessionStorageService.removeID('id');
    this.sessionStorageService.removeSessionStorage('id');
    this.router.navigate(['login']);
    this.logService.clear();
    
  }

  validateOTP(otp:string, userId:number){
      this.IAMService.validateOTP(otp, userId).subscribe(e=>{
        console.log(e)
        if (e == "Verified") {
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 100);
        } else if(e == "Expired") {
          this.alertService.error('OTP Expired, Please Requ est For New OTP', true);
        } else{
          this.alertService.error('Validation Failed, Please Try again.', true);
        }
      });
    }

    getOTP(userId:number){
      this.IAMService.getOTP(userId).subscribe(e=>{
        console.log(e)
        if (e == "sent") {
          
        } else{
          this.alertService.error('There is an error with request, Please Try again.', true);
        }
      });
    }

}
