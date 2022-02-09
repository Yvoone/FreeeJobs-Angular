import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import { JobListing } from 'src/app/entities/job-listing';

@Injectable({
  providedIn: 'root'
})
export class JobListingService {
  
  private jobListingUrl = 'http://localhost:8083/jobListing';

  constructor(private httpClient: HttpClient) {}

  getJobListingToBrowse(pageNumber: number, searchValue: string) {
    const URL = this.jobListingUrl + '/listAllOpenActiveJobListing';

    let params = new HttpParams()
    .set('pageNumber', pageNumber)
    .set('searchValue', searchValue);

    return this.httpClient.get<JobListing[]>(URL, {params});
  }

  getJobListingToBrowseTotal(searchValue: string) {
    const URL = this.jobListingUrl + '/getAllOpenActiveJobListingTotal';

    let params = new HttpParams()
    .set('searchValue', searchValue);

    return this.httpClient.get<number>(URL, {params});
  }

  getJobListingByUser(authorId: number): Observable<JobListing[]> {
    const URL = this.jobListingUrl + '/listJobListingByAuthorId';

    let params = new HttpParams()
      .set('authorId', authorId.toString());

    return this.httpClient.get<JobListing[]>(URL, {params});
  }

  getJobListingById(listingId: number): Observable<JobListing> {
    const URL = this.jobListingUrl + '/getJobListing/';

    let params = new HttpParams()
      .set('listingId', listingId.toString());

    return this.httpClient.get<JobListing>(URL, {params});
  }
}
