import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    JobListingDetailsComponent,
    JobListingBrowseComponent,
    ProfileComponent,
    JobListingModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
