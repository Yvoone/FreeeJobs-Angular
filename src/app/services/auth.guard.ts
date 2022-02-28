import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable,Subject  } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    private ngUnsubscribe: Subject<boolean> = new Subject()
    constructor(
        private authService: AuthService, 
        private router: Router
    ) {}

//     canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
//     return this.authService.isLoggedIn.pipe(
//         take(1),
//       map((isLoggedIn: boolean) => {
//           console.log(isLoggedIn)
          
//         if (!isLoggedIn) {
//           this.router.navigate(['/login']);
//           console.log("take??")
//           sessionStorage.clear();
//           return false;
//         }
//         return true;
//       })
//     );


//     // const currentUser = this.authService.currentUserValue;
//     // if (currentUser) {
//     //     // authorised so return true
//     //     return true;
//     // }
//     // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
//     // console.log(state.url);
//     // return false;
//   }

    
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean>  {
        console.log(this.authService.gettoken())
        console.log(sessionStorage.getItem('email'));
        console.log(sessionStorage.getItem('id'));
        if (this.authService.gettoken()) {
            console.log("true")
            return this.authService.gettoken();
        } 
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}})
        return false;
    }
}