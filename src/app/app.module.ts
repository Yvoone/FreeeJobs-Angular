import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";  
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
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
    AdminComponent
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
  ],
  exports: [
    NgbModule
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
