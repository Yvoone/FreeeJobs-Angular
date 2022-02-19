import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rating } from '../entities/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private ratingUrl = 'http://localhost:8085/rating';

  constructor(private httpClient: HttpClient) {}

  create(newRating: any): Observable<Rating[]> {
    const createUrl = this.ratingUrl + '/create';
    return this.httpClient.post<any>(createUrl, newRating);
  }

  getRatingsByUserId(userId: number): Observable<Rating[]> {
    const URL = this.ratingUrl + '/getRatingsByUserId';

    let params = new HttpParams()
      .set('userId', userId.toString());

    return this.httpClient.get<Rating[]>(URL, {params});
  }

  getRatingsByUserIdJobId(userId: number, jobId:number): Observable<Rating[]> {
    const URL = this.ratingUrl + '/getRatingsByUserIdJobId';

    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('jobId', jobId.toString());

    return this.httpClient.get<Rating[]>(URL, {params});
  }

}
