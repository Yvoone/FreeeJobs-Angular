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

  private IAMUrl = '/iam';
// private IAMUrl = 'https://freeejobs-iamms.herokuapp.com/iam'; //Cloud URL

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
      "aboutMeClient": user.aboutMeClient,
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

  uploadImage(imageFile: any) : Observable<any> {
    const URL = this.IAMUrl+'/upload';
    var data = new Subject<any>();
    this.httpClient.post<any>(URL, imageFile).subscribe(res=>{
      console.log(res)
      if(res.status!.statusCode!=200){
        this.commonService.backendError(res.status!);
        return;
      }else{
        this.commonService.logInfo(res.status!);
        data.next(res.data!);
      }
    })
    return data.asObservable();
  }

  // deleteImage(fileName: any, response: any) : Observable<any> {
  //   const URL = this.IAMUrl+ '/delete'+'/'+ fileName;
  //   var data = new Subject<any>();
  //   this.httpClient.post<any>(URL, response).subscribe(res=>{
  //     if(response.status!.statusCode!=200){
  //       this.commonService.backendError(response.status!);
  //       return;
  //     }else{
  //       this.commonService.logInfo(response.status!);
  //       data.next(response.data!);
  //     }
  //   })
  //   return data.asObservable();
  // }

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

  getSessionTimeout(userId: number): Observable<any> {
    const URL = this.IAMUrl + '/getUserSessionTimeout';
    let params = new HttpParams()
      .set('userId', userId.toString());
    var data = new Subject<any>();
    this.httpClient.get<IAPIResponse<any>>(URL, {params}).subscribe(response=>{
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

  logout(userId: string): Observable<any> {
    const URL = this.IAMUrl + '/logout';
    let params = new HttpParams()
      .set('userId', userId);
    var data = new Subject<any>();
    this.httpClient.get<IAPIResponse<any>>(URL, {params}).subscribe(response=>{
      if(response.status!.statusCode!=200){
        this.commonService.backendError(response.status!);
        return;
      }else{
        this.commonService.logInfo(response.status!);
        data.next(response);
      }
    });
    return data.asObservable();
  }

  validateOTP(otp:string, userId:number): Observable<any> {
    const URL = this.IAMUrl + '/validateOTP';
    let params = new HttpParams()
      .set('userId', userId)
      .set('inputOtp', otp);
    var data = new Subject<any>();
    this.httpClient.get<IAPIResponse<any>>(URL, {params}).subscribe(response=>{
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
  getOTP(userId:number): Observable<any> {
    const URL = this.IAMUrl + '/getOTP';
    let params = new HttpParams()
      .set('userId', userId);
    var data = new Subject<any>();
    this.httpClient.get<IAPIResponse<any>>(URL, {params}).subscribe(response=>{
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
