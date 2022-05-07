import { Injectable, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";  
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule, HttpClientXsrfModule, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor, HTTP_INTERCEPTORS} from "@angular/common/http";
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JobListingDetailsComponent } from './components/job-listing-details/job-listing-details.component';
import { JobListingBrowseComponent } from './components/job-listing-browse/job-listing-browse.component';
import { ProfileComponent } from './components/profile/profile.component';

import {NgxPaginationModule} from 'ngx-pagination';
import { JobListingModalComponent } from './components/job-listing-modal/job-listing-modal.component';
import { LoginComponent } from './components/login/login.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { AlertComponent } from './components/alert/alert.component';
import { AdminComponent } from './components/admin/admin.component';
import { LogService } from './services/log.service';
import { LogPublishersService } from './services/log-publishers.service';
import { PageNotFoundComponent } from './components/common/page-not-found/page-not-found.component';
import { AccessDeniedComponent } from './components/common/access-denied/access-denied.component';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from './models/date-formats';
import { Observable } from 'rxjs';
import { OtpComponent } from './components/otp/otp.component';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  constructor(private csrfTokenExtrator: HttpXsrfTokenExtractor,
    ) { }
    
   intercept(request: HttpRequest<any>, next: HttpHandler):   Observable<HttpEvent<any>> {
       // All HTTP requests are going to go through this method
       console.log("document:"+document);
       console.log("Cookie = ", document.cookie);
       const token = this.csrfTokenExtrator.getToken() as string;
       console.log("token = ", token);
       console.log("method = ", request.method);
       if ((request.method == "POST"||request.method == "PUT") && token != null) {
        const modifiedRequest = request.clone({ 
                headers: request.headers.set("X-XSRF-TOKEN", token),
            });
            console.log(modifiedRequest.headers);
            return next.handle(modifiedRequest);
        }
       return next.handle(request);
   }
  }

//   @Injectable()
// export class HttpXSRFInterceptor implements HttpInterceptor {

//   constructor(private tokenExtractor: HttpXsrfTokenExtractor) {
//   }

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log(req.url.toLowerCase());
//     const headerName = 'XSRF-TOKEN';
//     const respHeaderName = 'X-XSRF-TOKEN';
//     let token = this.tokenExtractor.getToken() as string;
//     if (token !== null && !req.headers.has(headerName)) {
//       req = req.clone({ headers: req.headers.set(respHeaderName, token) });
//     }
//     return next.handle(req);
//   }
// }
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    JobListingDetailsComponent,
    JobListingBrowseComponent,
    ProfileComponent,
    JobListingModalComponent,
    LoginComponent,
    TopbarComponent,
    RegisterComponent,
    AlertComponent,
    AdminComponent,
    PageNotFoundComponent,
    AccessDeniedComponent,
    OtpComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    MaterialModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientXsrfModule.withOptions({cookieName: 'XSRF-TOKEN',
    headerName: 'X-CSRF-TOKEN'}),
  ],
  exports: [
    NgbModule
  ],
  providers: [AuthService, AuthGuard, { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, LogService, LogPublishersService
    ,{ provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
