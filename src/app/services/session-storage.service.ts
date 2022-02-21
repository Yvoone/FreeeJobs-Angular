import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  // public sessionStorage: any;
  email_temp!:string;

  constructor() { }



  public setEmail(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  public getEmail(key: string): string {
    let temp2 = sessionStorage.getItem(key);
    // let temp = JSON.parse(sessionStorage.getItem(key)!)
    // this.email_temp = JSON.stringify(sessionStorage.getItem(key));
    // console.log("session com", this.email_temp)
    // console.log("session com", JSON.parse(sessionStorage.getItem(key)!))
    // this.email_temp = sessionStorage.getItem(key);
    // if (this.email_temp) {
    //   return this.email_temp;
    // } else { return "{}" }

    return temp2!
  }

  public removeEmail(key:string){
    console.log("remove?")
    sessionStorage.removeItem(key);
  }

  public clearAll(){
    sessionStorage.clear;
  }
}
