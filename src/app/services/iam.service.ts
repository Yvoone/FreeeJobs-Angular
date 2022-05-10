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
  // private IAMUrl = 'https://freeejobs-iam-ms.herokuapp.com/iam'; //Cloud URL

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
      "professionalTitle": user.professionalTitle,
      "profilePicUrl": user.profilePicUrl
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

  getLinkedInAccess(auth:any): Observable<any> {
    var data = new Subject<any>()
    const URL = 'https://www.linkedin.com/oauth/v2/accessToken';
    // let params = new HttpParams().set('oauth2_access_token', 'AQXH_i1Ty7yYuf28dYDExWe_4Prx9CHitdfIh1GEyEeSxhsfHCfkLJ692vHnLjZakYzfF9KLpAkT8PLPimwtj0nC3voT6fRgLTXVtfFpJFv7rRb8JVLFkf7plIh1AfefXuUF71aYXJWIlK_qlBbORbyMmsf_cr5pfmknU8myFQBpFE5Lac26FGyXC186YtKFxGDGhA_h6yBaaOvknQTxVlJ82x46zIc12WM1FVlc5x0QoEsWcoo0cRbpFKUhx8FTGSKgM4erYAv7DtST2xbVFXQQaByDFe0N22XxNYEwxspRJtc_7VZs64ZAJY-ywZmLvHIn06CbLWJrVsZWWIBdaHuwJcrKkg');
    let params = {
      'grant_type' : 'authorization_code',
      'code' : auth.toString(),
      'redirect_uri' : 'https://freeejobs-web.herokuapp.com/register',
      'client_id' : '86dyp3ax33yxnv',
      'client_secret' : 'yTTIjfaLrA18ryK2'
    };
    
    return this.httpClient.get<IAPIResponse<any>>(URL, {params}); 
  }

  getLinkedInAccess_login(auth:any): Observable<any> {
    var data = new Subject<any>()
    const URL = 'https://www.linkedin.com/oauth/v2/accessToken';
    // let params = new HttpParams().set('oauth2_access_token', 'AQXH_i1Ty7yYuf28dYDExWe_4Prx9CHitdfIh1GEyEeSxhsfHCfkLJ692vHnLjZakYzfF9KLpAkT8PLPimwtj0nC3voT6fRgLTXVtfFpJFv7rRb8JVLFkf7plIh1AfefXuUF71aYXJWIlK_qlBbORbyMmsf_cr5pfmknU8myFQBpFE5Lac26FGyXC186YtKFxGDGhA_h6yBaaOvknQTxVlJ82x46zIc12WM1FVlc5x0QoEsWcoo0cRbpFKUhx8FTGSKgM4erYAv7DtST2xbVFXQQaByDFe0N22XxNYEwxspRJtc_7VZs64ZAJY-ywZmLvHIn06CbLWJrVsZWWIBdaHuwJcrKkg');
    let params = {
      'grant_type' : 'authorization_code',
      'code' : auth.toString(),
      'redirect_uri' : 'https://freeejobs-web.herokuapp.com/login',
      'client_id' : '86dyp3ax33yxnv',
      'client_secret' : 'yTTIjfaLrA18ryK2'
    };
    
    return this.httpClient.get<IAPIResponse<any>>(URL, {params}); 
  }

  getLinkedInProfileName(token:any): Observable<any> {
    var data = new Subject<any>()
    const URL = 'https://api.linkedin.com/v2/me';
    let params = new HttpParams().set('oauth2_access_token', token.toString());
    console.log(token.toString())
    return this.httpClient.get<IAPIResponse<any>>(URL, {params});
  }

  getLinkedInProfileEmail(token:any): Observable<any> {
    const URL = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
    let params = new HttpParams().set('oauth2_access_token', token.toString());
    return this.httpClient.get<IAPIResponse<any>>(URL, {params});
  }

  getLinkedInProfilePictrue(token:any): Observable<any> {
    const URL = 'https://api.linkedin.com/v2/me?projection=(id,profilePicture(displayImage~digitalmediaAsset:playableStreams))';
    let params = new HttpParams().set('oauth2_access_token', token.toString());
    return this.httpClient.get<IAPIResponse<any>>(URL, {params});
  }

  registerLinkedInUser(first: string, last: string, id: string): Observable<any> {
    const URL = this.IAMUrl + '/registerLinkedInUser';

    let reqBody: any = {
      "id": "",
      "firstName": first,
      "lastName": last,
      "linkedInId": id,
    }

    var data = new Subject<any>();
      this.httpClient.post<IAPIResponse<any>>(URL, reqBody).subscribe(response=>{
        console.log(response)
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
      "professionalTitle": user.professionalTitle,
      "profilePicUrl": user.profilePicUrl,
      "resumeUrl": user.resumeUrl
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

  linkedInLogin(id: any): Observable<any> {
    const URL = this.IAMUrl + '/linkedInLogin';
    let reqBody: any = {
      "linkedInId": id,
      "email": "",
      "id": "",
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

  linkedInLogin_test(linkedInAuth: any): Observable<any> {
    const URL = this.IAMUrl + '/linkedInLogin';
    let reqBody: any = {
      "authCode": linkedInAuth
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

  linkedInLogin_test2(linkedInAuth: any): Observable<any> {
    const URL = this.IAMUrl + '/linkedInLogin';
    let reqBody: any = {
      "authCode": linkedInAuth
    }
    console.log("In IAMMMS",linkedInAuth )
    // let params = new HttpParams().set('authCode', linkedInAuth);
    return this.httpClient.post<IAPIResponse<any>>(URL, reqBody);
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

  forgetPassword(email:any): Observable<any> {
    const URL = this.IAMUrl + '/forgetPassword';
    let reqBody: any = {
      "email": email
    }
    console.log("email: ", email )
    // let params = new HttpParams().set('authCode', linkedInAuth);
    return this.httpClient.post<IAPIResponse<any>>(URL, reqBody);
  }

  getUsersToResetPassword(): Observable<any> {
    const URL = this.IAMUrl + '/getUsersToResetPassword';
    // let params = new HttpParams().set('authCode', linkedInAuth);
    return this.httpClient.get<IAPIResponse<any>>(URL);
  }

  informResetPassword(email:any, id:any): Observable<any> {
    const URL = this.IAMUrl + '/informResetPassword';
    let reqBody: any = {
      "email": email,
      "userId": id
    }
    return this.httpClient.post<IAPIResponse<any>>(URL, reqBody);
  }

}
