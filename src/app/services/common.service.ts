import { Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { APIResponseStatus } from '../entities/apiresponse-status';
import { ErrorMessageEnum } from '../models/error-message-enum';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

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
