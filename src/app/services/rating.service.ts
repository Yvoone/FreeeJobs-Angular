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

  getRatingsByTargetId(targetId: number): Observable<Rating[]> {
    const URL = this.ratingUrl + '/getRatingsByTargetId';

    let params = new HttpParams()
      .set('targetId', targetId.toString());

    return this.httpClient.get<Rating[]>(URL, {params});
  }

  getRatingsByReviewerId(reviewerId: number): Observable<Rating[]> {
    const URL = this.ratingUrl + '/getRatingsByReviewerId';

    let params = new HttpParams()
      .set('reviewerId', reviewerId.toString());

    return this.httpClient.get<Rating[]>(URL, {params});
  }

  getRatingsByReviewerIdJobId(userId: number, jobId:number): Observable<Rating[]> {
    const URL = this.ratingUrl + '/getRatingsByReviewerIdJobId';

    let params = new HttpParams()
      .set('reviewerId', userId.toString())
      .set('jobId', jobId.toString());

    return this.httpClient.get<Rating[]>(URL, {params});
  }

}
