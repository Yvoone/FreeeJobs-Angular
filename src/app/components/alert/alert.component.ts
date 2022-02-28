import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from "../../services/alert.service";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  
  public isVisible!:boolean;
  showSuccessMsg:boolean =false;
  showErrorMsg:boolean =false;

  message: any;
  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.subscription = this.alertService.getAlert()
        .subscribe(message => {
          this.isVisible =true;
            switch (message && message.type) {
                case 'success':
                    this.showSuccessMsg =true;
                    message.cssClass = 'alert alert-success';
                    break;
                case 'error':
                    this.showErrorMsg =true;
                    message.cssClass = 'alert alert-danger';
                    break;
            }

            this.showAlert();
            this.message = message;
        });
    this.showAlert();
  }

  showAlert(): void{
    setTimeout(() => {
      this.isVisible = false;
      // this.showSuccessMsg = false;
      // this.showErrorMsg = false;
    }, 2000);
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
}
