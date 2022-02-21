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
  display_topbar!: boolean;
  isLoggedIn$!: Observable<boolean>; 
  islogin!:boolean


  constructor(
    private readonly sessionStorageService: SessionStorageService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  onLogout(){
    this.sessionStorageService.removeEmail('email');
    this.authService.logout();                      // {3}
    console.log("logout action")
    this.islogin=false;
  }

  checkEmailSession(){
    this.email = this.sessionStorageService.getEmail('email');
    console.log(this.email)
    if (this.email){
      console.log("topbar")
      
      this.display_topbar =true;
    } else {
      console.log("no topbar")
      this.display_topbar =false;
    }
  }

}
