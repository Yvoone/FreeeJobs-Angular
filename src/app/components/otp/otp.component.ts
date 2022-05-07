import { HostListener } from '@angular/core';
import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  otpForm!: FormGroup;
  submitted: boolean = false;
  otp_require!: boolean;

  control: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sessionStorageService: SessionStorageService) { }

  ngOnInit(): void {
    this.otpForm = this.formBuilder.group({

      otp: ['', Validators.required]
    });
  }

  onSubmit(){
    this.control = this.otpForm.controls;
    this.otp_require = this.control.otp.errors
    if (this.otpForm.valid) {
      this.submitted = true;

      this.authService.validateOTP(this.otpForm.value.otp, Number(this.sessionStorageService.getSessionStorage('id')));

    } else {
      this.submitted = false;
    }
  }

  resendOTP(){
    this.authService.getOTP(Number(this.sessionStorageService.getSessionStorage('id')));
  }

  requestOTP(){
    this.authService.getOTP(Number(this.sessionStorageService.getSessionStorage('id')));
  }

  goBackToLogin(){
    this.authService.logout();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.authService.logout();
  }

}
