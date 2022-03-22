import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { Application } from '../entities/application';
import { User } from '../entities/user';
import { CommonService } from './common.service';
import { IAPIResponse } from '../entities/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class IAMService {

  private IAMUrl = 'http://localhost:8082/iam';

  constructor(private httpClient: HttpClient,
    private commonService: CommonService) { }

  getUserByUserId(userId: number): Observable<User> {
    const URL = this.IAMUrl + '/userProfile';

    let params = new HttpParams()
      .set('userId', userId.toString());

      var data = new Subject<User>();
      this.httpClient.get<IAPIResponse<User>>(URL, {params}).subscribe(response=>{
        if(response.status!.statusCode!=200){
          this.commonService.backendError(response.status!);
          return;
        }else{
          this.commonService.logInfo(response.status!);
          data.next(response.data!);
        }
      });
      return data.asObservable();
  }

  registerUser(user: User): Observable<any> {
    const URL = this.IAMUrl + '/registerUser';

    let reqBody: any = {
      "id": "",
      "password": this.commonService.encryptValue(user.password),
      "firstName": user.firstName,
      "lastName": user.lastName,
      "email": user.email,
      "contactNo": user.contactNo,
      "gender": user.gender,
      "dob": user.dob,
      "aboutMe": user.aboutMe,
      "skills": user.skills,
      "linkedInAcct": user.linkedInAcct,
      "professionalTitle": user.professionalTitle
    }

    var data = new Subject<any>();
      this.httpClient.post<IAPIResponse<any>>(URL, reqBody).subscribe(response=>{
        if(response.status!.statusCode!=200){
          this.commonService.backendError(response.status!);
          return;
        }else{
          this.commonService.logInfo(response.status!);
          data.next(response.data!);
        }
      });
      return data.asObservable();
  }

  // updateUser(updatedUser: any) {
  //   const URL = this.IAMUrl + '/' + updatedUser.id + '/edit';
  //   return this.httpClient.put<any>(URL, updatedUser);
  // }

  getUserProfileWithEmailByUserId(userId: number): Observable<User> {
    const URL = this.IAMUrl + '/userProfileWithEmail';

    let params = new HttpParams()
      .set('userId', userId.toString());
    var data = new Subject<User>();
    this.httpClient.get<IAPIResponse<User>>(URL, {params}).subscribe(response=>{
      if(response.status!.statusCode!=200){
        this.commonService.backendError(response.status!);
        return;
      }else{
        this.commonService.logInfo(response.status!);
        data.next(response.data!);
      }
    });
    return data.asObservable();
  }

  updateUser(user: any): Observable<any>  {
    const URL = this.IAMUrl + '/' + user.id + '/edit';

    let reqBody: any = {
      "id": user.id,
      "password": user.password,
      "firstName": user.firstName,
      "lastName": user.lastName,
      "email": user.email,
      "contactNo": user.contactNo,
      "aboutMe": user.aboutMe,
      "aboutMeClient": user.aboutMeClient,
      "skills": user.skills,
      "professionalTitle": user.professionalTitle
    }
    var data = new Subject<any>();
    this.httpClient.put<IAPIResponse<any>>(URL, reqBody).subscribe(response=>{
      if(response.status!.statusCode!=200){
        this.commonService.backendError(response.status!);
        return;
      }else{
        this.commonService.logInfo(response.status!);
        data.next(response.data!);
      }
    });
    return data.asObservable();
  }

  login(user: User): Observable<any> {
    const URL = this.IAMUrl + '/login';
    let reqBody: any = {
      "password": this.commonService.encryptValue(user.password),
      "email": user.email
    }
    var data = new Subject<any>();
    this.httpClient.post<IAPIResponse<any>>(URL, reqBody).subscribe(response=>{
      if(response.status!.statusCode!=200){
        this.commonService.backendErrorLoginOnly(response.status!);
        data.next(response.data!);
      }else{
        this.commonService.logInfo(response.status!);
        data.next(response.data!);
      }
    });
    return data.asObservable();
  }

}
