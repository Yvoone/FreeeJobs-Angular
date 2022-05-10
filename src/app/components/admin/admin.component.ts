import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IAMService } from "../../services/iam.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    private IAMService: IAMService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getReuqest();
  }

  //get requests of password change
  list : any[] | undefined;
  getReuqest(){
    let list_temp: any[]
    this.IAMService.getUsersToResetPassword().subscribe(response => {
      console.log(response)
      this.list = response.data;
    })
    
  }

  //action to change password
  requestEmail:any
  requestUserId:any;
  resetPassword(content:any, requestEmail: number, requestUserId: number){
    this.requestEmail = requestEmail
    this.requestUserId = requestUserId
    this.modalService.open(content, {centered: true });
    // change to default password "1!Qazxcnm", then send email
  }

  confirmReset(){
    this.IAMService.informResetPassword(this.requestEmail, this.requestUserId).subscribe(response => {
      console.log(response)
      console.log('Reset')
      this.modalService.dismissAll();
    })
    
  }

  deleteUser(content:any, requestId: number){
    this.modalService.open(content, {centered: true });
    // change to default password "1!Qazxcnm", then send email
  }

  confirmDelete(){
    console.log('Delete')
    this.modalService.dismissAll();
  }

}
