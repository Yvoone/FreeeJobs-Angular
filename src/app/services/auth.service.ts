import { Component, OnInit, Input, Output, EventEmitter, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { User } from "../entities/user";
import { SessionStorageService } from "../services/session-storage.service";
import {  BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';



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
    email= this.sessionStorageService.getEmail('email');
    console.log(email)
    if (email) {
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false)
    }
    return this.loggedIn.asObservable(); // {2}
  }

  gettoken(){
    console.log(sessionStorage.getItem("email"))
    if(sessionStorage.getItem("email") !=null){
      return true;
    } else {
      return false;
    }
    // return !!sessionStorage.getItem("email");
  }


  constructor(
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private http: HttpClient
  ) {}


  login(email: string, password: string){
    console.log("auth service login in")
    if (email !== '' && password !== '' ) { // {3}
      this.loggedIn.next(true);
      this.loggedIn2.next('loggin');
      sessionStorage.clear();
      console.log(this.sessionStorageService.getEmail('email'));
      this.sessionStorageService.setEmail('email', email);
      this.router.navigate(['/dashboard']);
      // this.router.navigateByUrl("")
    }
  }

  logout() {                            // {4}
    console.log("logout?")
    this.loggedIn.next(false);
    sessionStorage.clear;
    this.sessionStorageService.removeEmail('email');
    this.router.navigate(['login']);
  }

}
