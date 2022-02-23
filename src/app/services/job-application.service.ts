import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import { Application } from '../entities/application';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {

  private jobApplicationUrl = 'http://localhost:8084/jobApplication';

  constructor(private httpClient: HttpClient) {}

  getApplicationByUser(authorId: number): Observable<Application[]> {
    const URL = this.jobApplicationUrl + '/listApplication/' + encodeURIComponent(authorId);

    let params = new HttpParams()
      .set('authorId', authorId.toString());

    return this.httpClient.get<Application[]>(URL, {params});
  }

  getApplicantsByJobId(jobId: number): Observable<Application[]> {
    const URL = this.jobApplicationUrl + '/listApplicantsByJobId';

    let params = new HttpParams()
      .set('jobId', jobId.toString());

    return this.httpClient.get<Application[]>(URL, {params});
  }

  getAcceptedApplicantsByJobId(jobId: number): Observable<Application[]> {
    const URL = this.jobApplicationUrl + '/listAcceptedApplicantsByJobId';

    let params = new HttpParams()
      .set('jobId', jobId.toString());

    return this.httpClient.get<Application[]>(URL, {params});
  }

  applyJob(jobId: number, userId: number, description: String): Observable<any> {
    const URL = this.jobApplicationUrl + '/applyJob';

    let reqBody : any =  {
      "jobId": jobId,
      "applicantId":userId,
      "description": description
    }

    return this.httpClient.post<any>(URL, reqBody);
  }

  setApplicantsStatus(jobId: number, userId: number, status: String) {
    const URL = this.jobApplicationUrl + '/setAppStatus';

    let reqBody : any =  {
      "jobId": jobId,
      "applicantId":userId,
      "status": status
    }

    return this.httpClient.post<any>(URL, reqBody);

  }

  closeApplicantsStatus(jobId: number, status: String) {
    const URL = this.jobApplicationUrl + '/closeAppStatus';

    let reqBody : any =  {
      "jobId": jobId,
      "status": status
    }

    return this.httpClient.post<any>(URL, reqBody);

  }

  openApplication(listingId: number): Observable<Application[]> {
    const URL = this.jobApplicationUrl + '/getJobListing/' + encodeURIComponent(listingId);

    let params = new HttpParams()
      .set('listingId', listingId.toString());

    return this.httpClient.get<Application[]>(URL, {params});
  }
}
