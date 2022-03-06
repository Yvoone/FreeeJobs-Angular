import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  // public sessionStorage: any;
  email_temp!:string;

  constructor() { }



  // public setEmail(key: string, value: string): void {
  //   sessionStorage.setItem(key, value);
  // }
  // public setID(key:string, value:string):void{
  //   sessionStorage.setItem(key,value);
  // }

  public setSessionStorage(key: string, value: any): void {
    sessionStorage.setItem(key, value);
  }

  // public getEmail(key: string): string {
  //   let email_temp = sessionStorage.getItem(key);
  //   // let temp = JSON.parse(sessionStorage.getItem(key)!)
  //   // this.email_temp = JSON.stringify(sessionStorage.getItem(key));
  //   // console.log("session com", this.email_temp)
  //   // console.log("session com", JSON.parse(sessionStorage.getItem(key)!))
  //   // this.email_temp = sessionStorage.getItem(key);
  //   // if (this.email_temp) {
  //   //   return this.email_temp;
  //   // } else { return "{}" }

  //   return email_temp!
  // }

  // public getID(key:string): string {
  //   let id_temp = sessionStorage.getItem(key);
  //   return id_temp!;
  // }

  public getSessionStorage(key:string): any {
    let session_temp = sessionStorage.getItem(key);
    return session_temp!;
  }

  // public removeEmail(key:string){
  //   console.log("remove email?")
  //   sessionStorage.removeItem(key);
  // }

  // public removeID(key:string){
  //   console.log("remove id?")
  //   sessionStorage.removeItem(key);
  // }

  public removeSessionStorage(key:string){
    console.log("remove "+ key +"?")
    sessionStorage.removeItem(key);
  }

  public clearAll(){
    sessionStorage.clear;
  }
}
