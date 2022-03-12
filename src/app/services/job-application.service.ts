import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

import { Application } from '../entities/application';
import { CommonService } from './common.service';
import { IAPIResponse } from '../entities/apiresponse';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {

  private jobApplicationUrl = 'http://localhost:8084/jobApplication';

  constructor(private httpClient: HttpClient,
    private commonService: CommonService,
    private modalService: NgbModal) {}

  getApplicationByUser(applicantId: number, status: String): Observable<Application[]> {
    const URL = this.jobApplicationUrl + '/listJobApplicationByApplicantIdAndStatus';

    let params = new HttpParams()
      .set('applicantId', applicantId.toString())
      .set('status', status.toString());

      var data = new Subject<Application[]>();
      this.httpClient.get<IAPIResponse<Application[]>>(URL, {params}).subscribe(response=>{
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

  getApplicantsByJobId(jobId: number): Observable<Application[]> {
    const URL = this.jobApplicationUrl + '/listApplicantsByJobId';

    let params = new HttpParams()
      .set('jobId', jobId.toString());

      var data = new Subject<Application[]>();
      this.httpClient.get<IAPIResponse<Application[]>>(URL, {params}).subscribe(response=>{
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

  getAcceptedApplicantsByJobId(jobId: number): Observable<Application[]> {
    const URL = this.jobApplicationUrl + '/listAcceptedApplicantsByJobId';

    let params = new HttpParams()
      .set('jobId', jobId.toString());

      var data = new Subject<Application[]>();
      this.httpClient.get<IAPIResponse<Application[]>>(URL, {params}).subscribe(response=>{
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

  applyJob(jobId: number, userId: number, description: String): Observable<any> {
    const URL = this.jobApplicationUrl + '/applyJob';

    let reqBody : any =  {
      "jobId": jobId,
      "applicantId":userId,
      "description": description
    }
    var data = new Subject<any>();
    this.httpClient.post<IAPIResponse<any>>(URL, reqBody).subscribe(response=>{
      if(response.status!.statusCode!=200){
        this.commonService.backendError(response.status!);
        this.modalService.dismissAll();
        return;
      }else{
        this.commonService.logInfo(response.status!);
        data.next(response.data!);
      }
      });
    return data.asObservable();
  }

  setApplicantsStatus(jobId: number, userId: number, status: String) {
    const URL = this.jobApplicationUrl + '/setAppStatus';

    let reqBody : any =  {
      "jobId": jobId,
      "applicantId":userId,
      "status": status
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

  closeApplicantsStatus(jobId: number, status: String) {
    const URL = this.jobApplicationUrl + '/closeAppStatus';

    let reqBody : any =  {
      "jobId": jobId,
      "status": status
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

  openApplication(listingId: number): Observable<Application[]> {
    const URL = this.jobApplicationUrl + '/getJobListing/' + encodeURIComponent(listingId);

    let params = new HttpParams()
      .set('listingId', listingId.toString());
      var data = new Subject<Application[]>();
      this.httpClient.get<IAPIResponse<Application[]>>(URL, {params}).subscribe(response=>{
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

  getAcceptedApplicationsByApplicantId(applicantId: number): Observable<Application[]> {
    const URL = this.jobApplicationUrl + '/listAcceptedJobApplicationByApplicantId';

    let params = new HttpParams()
      .set('applicantId', applicantId.toString());
      var data = new Subject<Application[]>();
      this.httpClient.get<IAPIResponse<Application[]>>(URL, {params}).subscribe(response=>{
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

  getUserApplicationStatus(jobId: number, userId: number) {
    const URL = this.jobApplicationUrl + '/getUserApplicationStatus';

    let params = new HttpParams()
      .set('jobId', jobId.toString())
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
}
