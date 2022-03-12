import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { IAPIResponse } from '../entities/apiresponse';
import { Rating } from '../entities/rating';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private ratingUrl = 'http://localhost:8085/rating';

  constructor(private httpClient: HttpClient,
    private commonService: CommonService,
    private modalService: NgbModal) {}

  create(newRating: any): Observable<Rating[]> {
    const createUrl = this.ratingUrl + '/create';
    var data = new Subject<Rating[]>();
    this.httpClient.post<IAPIResponse<Rating[]>>(createUrl, newRating).subscribe(response=>{
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

  getRatingsByTargetId(targetId: number): Observable<Rating[]> {
    const URL = this.ratingUrl + '/getRatingsByTargetId';

    let params = new HttpParams()
      .set('targetId', targetId.toString());
    
      var data = new Subject<Rating[]>();
      this.httpClient.get<IAPIResponse<Rating[]>>(URL, {params}).subscribe(response=>{
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

  getRatingsByReviewerId(reviewerId: number): Observable<Rating[]> {
    const URL = this.ratingUrl + '/getRatingsByReviewerId';

    let params = new HttpParams()
      .set('reviewerId', reviewerId.toString());
    var data = new Subject<Rating[]>();
    this.httpClient.get<IAPIResponse<Rating[]>>(URL, {params}).subscribe(response=>{
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

  getRatingsByReviewerIdJobId(userId: number, jobId:number): Observable<Rating[]> {
    const URL = this.ratingUrl + '/getRatingsByReviewerIdJobId';

    let params = new HttpParams()
      .set('reviewerId', userId.toString())
      .set('jobId', jobId.toString());
      
      var data = new Subject<Rating[]>();
      this.httpClient.get<IAPIResponse<Rating[]>>(URL, {params}).subscribe(response=>{
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
