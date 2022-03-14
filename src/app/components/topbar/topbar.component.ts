import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/entities/user';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { SessionStorageService } from "../../services/session-storage.service";
import { AuthService } from "../../services/auth.service";
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  email!: string;
  id!:any;
  display_topbar!: boolean;
  isLoggedIn$!: Observable<boolean>;
  islogin!:boolean
  loginemail!: string;
  loginID!: string;

  constructor(
    private readonly sessionStorageService: SessionStorageService,
    private readonly authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.checkEmailSession();
    // console.log(this.isLoggedIn$)
  }

  routeToProfile(){
    this.router.navigate(['/profile']);
    
    // this.sessionStorageService.removeSessionStorage('applicantProfileId');
  }

  onLogout(){
    //this.sessionStorageService.removeEmail('email');
    this.sessionStorageService.removeSessionStorage('email');
    // this.sessionStorageService.removeID('id');
    this.sessionStorageService.removeSessionStorage('id');
    this.authService.logout();                      // {3}
    console.log("logout action")
    this.islogin=false;
  }

  checkEmailSession(){
    //this.email = this.sessionStorageService.getEmail('email');
    this.email = this.sessionStorageService.getSessionStorage('email');
    //this.id = this.sessionStorageService.getID('id');
    this.id = this.sessionStorageService.getSessionStorage('id');
    console.log(this.email)
    if (this.email){
      console.log("topbar")

      this.display_topbar =true;
    } else {
      console.log("no topbar")
      this.display_topbar =false;
    }
  }

  checkSession(){
    //this.loginemail = this.sessionStorageService.getEmail('email');
    this.loginemail = this.sessionStorageService.getSessionStorage('email');
    //this.loginID = this.sessionStorageService.getID('id');
    this.loginID = this.sessionStorageService.getSessionStorage('id');
  }

}
