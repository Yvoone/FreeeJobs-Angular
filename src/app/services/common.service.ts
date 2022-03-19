import { Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { APIResponseStatus } from '../entities/apiresponse-status';
import { Application } from '../entities/application';
import { JobListing } from '../entities/job-listing';
import { Rating } from '../entities/rating';
import { User } from '../entities/user';
import { ErrorMessageEnum } from '../models/error-message-enum';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  contactNumberRegEx = /^(?:\+65)?[689][0-9]{7}$/;

  constructor(private logService: LogService,
    private router: Router) {}

  checkFormContentsBeforeDisplay(title: string, details: string, rate: string, classname:string) {
    let errors: Array<string>=[];
    if(typeof title!="string"){
      errors.push("title not string");
    }
    if(typeof details!="string"){
      errors.push("details not string");
    }
    if(!Number(rate)){
      errors.push("rate not number");
    }
    if(errors.length>0){
      this.logService.error(ErrorMessageEnum.paramError, errors, classname);
      this.router.navigate(["/pageNotFound"]);
    }
  }
  //dashboard, browse, profile
  checkJobListingBeforeDisplay(title: string, details: string, rate: string, status: string, jobListingId: number, classname:string) {
    let errors: Array<string>=[];
    if(typeof title!="string"){
      errors.push("title not string");
    }
    if(typeof details!="string"){
      errors.push("details not string");
    }
    if(!Number(rate)){
      errors.push("rate not number");
    }
    if(typeof status!="string"){
      errors.push("status not string");
    }
    if(errors.length>0){
      this.logService.error(ErrorMessageEnum.paramError, errors, classname);
      this.router.navigate(["/pageNotFound"]);
    }
  }
  
  //Dashboard 
  checkJobAppBeforeDisplay(title: string, details: string, status: string, jobListingId: number, classname:string) {
    let errors: Array<string>=[];
    if(typeof title!="string"){
      errors.push("title not string");
    }
    if(typeof details!="string"){
      errors.push("details not string");
    }
    if(typeof status!="string"){
      errors.push("status not string");
    }
    if(errors.length>0){
      this.logService.error(ErrorMessageEnum.paramError, errors, classname);
      this.router.navigate(["/pageNotFound"]);
    }
  }

  checkAppicationBeforeDisplay(response: any, classname:string) {
    let errors: Array<string>=[];
    if(response !instanceof Application){
      errors.push("Application is invalid");
    }
    if(!Number(response.jobId)){
      errors.push("job Id not number");
    }
    if(!Number(response.applicantId)){
      errors.push("applicant Id not number");
    }
    if(typeof response.description!="string"){
      errors.push("application description not string");
    }
    if(typeof response.status!="string"){
      errors.push("status not string");
    }
    if(errors.length>0){
      this.logService.error(ErrorMessageEnum.paramError, errors, classname);
      this.router.navigate(["/pageNotFound"]);
    }
  }
  
  checkJobListingDetailsBeforeDisplay(response: any, classname:string){
    let errors: Array<string>=[];
    if(response !instanceof JobListing){
      errors.push("Job Listing is invalid");
    }
    if(!Number(response.authorId)){
      errors.push("author Id not number");
    }
    if(!Number(response.rate)){
      errors.push("rate not number");
    }
    if(typeof response.title!="string"){
      errors.push("title not string");
    }
    if(typeof response.details!="string"){
      errors.push("details not string");
    }
    if(typeof response.rateType!="string"){
      errors.push("rate type not string");
    }
    if(typeof response.status!="string"){
      errors.push("status not string");
    }
    // if(response.dateCreated !instanceof Date){
    //   errors.push("date created is not of date type");
    // }
    if(errors.length>0){
      this.logService.error(ErrorMessageEnum.paramError, errors, classname);
      this.router.navigate(["/pageNotFound"]);
    }
  }
  
  checkRatingBeforeDisplay(response: any, classname:string){
    let errors: Array<string>=[];
    if(response !instanceof Rating){
      errors.push("Job Listing is invalid");
    }
    if(!Number(response.jobId)){
      errors.push("job Id not number");
    }
    if(!Number(response.reviewerId)){
      errors.push("reviewer id not number");
    }
    if(!Number(response.targetId)){
      errors.push("target id not number");
    }
    if(typeof response.reviewTitle!="string"){
      errors.push("review title not string");
    }
    if(typeof response.review!="string"){
      errors.push("review not string");
    }
    if(!Number(response.ratingScale)){
      errors.push("rating scale not number");
    }
    if(errors.length>0){
      this.logService.error(ErrorMessageEnum.paramError, errors, classname);
      this.router.navigate(["/pageNotFound"]);
    }
  }
  
  checkUserInfoBeforeDisplay(response: any, classname:string){
    let errors: Array<string>=[];
    if(response !instanceof User){
      errors.push("User is invalid");
    }
    if(typeof response.firstName!="string"){
      errors.push("first name not string");
    }
    if(typeof response.lastName!="string"){
      errors.push("last name not string");
    }
    if(typeof response.email!="string"||!this.emailRegEx.test(response.email)){
      errors.push("email invalid");
    }
    if(typeof response.contactNo!="string"||!this.contactNumberRegEx.test(response.contactNo)){
      errors.push("contact number invalid");
    }
    if(typeof response.gender!="string"){
      errors.push("gender not string");
    }
    if(typeof response.aboutMe!="string"){
      errors.push("about me not string");
    }
    if(typeof response.skills!="string"){
      errors.push("skills not string");
    }
    if(typeof response.professionalTitle!="string"){
      errors.push("professional title not string");
    }
    if(errors.length>0){
      this.logService.error(ErrorMessageEnum.paramError, errors, classname);
      this.router.navigate(["/pageNotFound"]);
    }
  }
  checkIfNumber(value: any, valueType: string, classname:string){
    let errors: Array<string>=[];
    if(!Number(value)){
      errors.push(valueType+" not number");
    }
    if(errors.length>0){
      this.logService.error(ErrorMessageEnum.paramError, errors, classname);
      this.router.navigate(["/pageNotFound"]);
    }
  }
  checkIfString(value: any, valueType: string, classname:string){
    let errors: Array<string>=[];
    if(typeof value!="string"){
      errors.push(valueType+" not string");
    }
    if(errors.length>0){
      this.logService.error(ErrorMessageEnum.paramError, errors, classname);
      this.router.navigate(["/pageNotFound"]);
    }
  }

  backendError(errors: APIResponseStatus){
    this.logService.error(errors.statusCode!+': '+errors.statusText+', '+errors.message);
    this.router.navigate(["/pageNotFound"]);
  }
  backendErrorLoginOnly(errors: APIResponseStatus){
    this.logService.error(errors.statusCode!+': '+errors.statusText+', '+errors.message);
  }
  logInfo(info: APIResponseStatus){
    this.logService.info(info.statusCode!+': '+info.statusText+', '+info.message);
  }
}
