import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Application } from '../entities/application';
import { User } from '../entities/user';

@Injectable({
  providedIn: 'root'
})
export class IAMService {

  private IAMUrl = 'http://localhost:8082/iam';

  constructor(private httpClient: HttpClient) { }

  getUserByUserId(userId: number): Observable<User> {
    const URL = this.IAMUrl + '/userProfile';

    let params = new HttpParams()
      .set('userId', userId.toString());

    return this.httpClient.get<User>(URL, { params });
  }

  registerUser(user: User): Observable<any> {
    const URL = this.IAMUrl + '/registerUser';

    let reqBody: any = {
      "id": "",
      "password": user.password,
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

    return this.httpClient.post<any>(URL, reqBody);
  }
  
  updateUser(updatedUser: any) {
    const URL = this.IAMUrl + '/' + updatedUser.id + '/edit';
    return this.httpClient.put<any>(URL, updatedUser);
  }

  login(user: User): Observable<any> {
    const URL = this.IAMUrl + '/login';

    let reqBody: any = {
      "password": user.password,
      "email": user.email
    }

    return this.httpClient.post<any>(URL, reqBody);
  }

}
