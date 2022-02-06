import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import { Application } from '../entities/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private jobListingUrl = 'http://localhost:8081/application';

  constructor(private httpClient: HttpClient) {}

  getApplicationByUser(authorId: number): Observable<Application[]> {
    const URL = this.jobListingUrl + '/listApplication/' + encodeURIComponent(authorId);

    let params = new HttpParams()
      .set('authorId', authorId.toString());

    return this.httpClient.get<Application[]>(URL, {params});
  }

  openApplication(listingId: number): Observable<Application[]> {
    const URL = this.jobListingUrl + '/getJobListing/' + encodeURIComponent(listingId);

    let params = new HttpParams()
      .set('listingId', listingId.toString());

    return this.httpClient.get<Application[]>(URL, {params});
  }
}
