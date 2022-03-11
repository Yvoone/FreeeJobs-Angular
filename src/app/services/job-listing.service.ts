import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, Subject} from 'rxjs';

import { JobListing } from 'src/app/entities/job-listing';
import { IAPIResponse } from '../entities/apiresponse';
import { CommonService } from './common.service';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class JobListingService {
  private jobListingUrl = 'http://localhost:8083/jobListing';

  constructor(private httpClient: HttpClient,
    private commonService: CommonService) {}

  getJobListingToBrowse(pageNumber: number, searchValue: string) {
    const URL = this.jobListingUrl + '/listAllOpenActiveJobListing';

    let params = new HttpParams()
    .set('pageNumber', pageNumber)
    .set('searchValue', searchValue);

    var data = new Subject<JobListing[]>();
      this.httpClient.get<IAPIResponse<JobListing[]>>(URL, {params}).subscribe(response=>{
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

  getJobListingToBrowseTotal(searchValue: string) {
    const URL = this.jobListingUrl + '/getAllOpenActiveJobListingTotal';

    let params = new HttpParams()
    .set('searchValue', searchValue);

    var data = new Subject<number>();
      this.httpClient.get<IAPIResponse<number>>(URL, {params}).subscribe(response=>{
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

  getJobListingByUser(authorId: number): Observable<JobListing[]> {
    const URL = this.jobListingUrl + '/listJobListingByAuthorId';
    let params = new HttpParams()
      .set('authorId', authorId.toString());

      var data = new Subject<JobListing[]>();
      this.httpClient.get<IAPIResponse<JobListing[]>>(URL, {params}).subscribe(response=>{
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

  getJobListingByUserAndStatus(authorId: number, status: String) {
    const URL = this.jobListingUrl + '/listJobListingByAuthorIdAndStatus';

    let params = new HttpParams()
      .set('authorId', authorId.toString())
      .set('status', status.toString());

      var data = new Subject<JobListing[]>();
      this.httpClient.get<IAPIResponse<JobListing[]>>(URL, {params}).subscribe(response=>{
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

  getJobListingById(listingId: number): Observable<JobListing> {
    const URL = this.jobListingUrl + '/getJobListing/';

    let params = new HttpParams()
      .set('listingId', listingId.toString());

    var data = new Subject<JobListing>();
    this.httpClient.get<IAPIResponse<JobListing>>(URL, {params}).subscribe(response=>{
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
  updateListing(updatedListing: any) {
    const URL = this.jobListingUrl + '/' + updatedListing.id + '/edit';

    var data = new Subject<any>();
      this.httpClient.put<IAPIResponse<any>>(URL, updatedListing).subscribe(response=>{
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

  create(newListing: any): Observable<JobListing> {
    const createUrl = this.jobListingUrl + '/create';
    
    var data = new Subject<JobListing>();
    this.httpClient.post<IAPIResponse<JobListing>>(createUrl, newListing).subscribe(response=>{
      if(response.status!.statusCode!=200){
        this.commonService.backendError(response.status!);
        return;
      }else{
        this.commonService.logInfo(response.status!);
        data.next(response.data!);
      }
    });
    return data.asObservable();
    //return this.httpClient.post<any>(createUrl, newListing);
  }
  updateJobStatus(status: string, jobId: number){
    const URL = this.jobListingUrl + '/' + jobId + '/updateJobListingStatus';
    var data = new Subject<any>();
      this.httpClient.put<IAPIResponse<any>>(URL, status).subscribe(response=>{
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

  getCompletedJobListingById(listingId: number): Observable<JobListing> {
    const URL = this.jobListingUrl + '/getCompletedJobListing/';

    let params = new HttpParams()
      .set('listingId', listingId.toString());
      var data = new Subject<JobListing>();
      this.httpClient.get<IAPIResponse<JobListing>>(URL, {params}).subscribe(response=>{
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


