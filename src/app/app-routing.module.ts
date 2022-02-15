import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JobListingBrowseComponent } from './components/job-listing-browse/job-listing-browse.component';
import { JobListingDetailsComponent } from './components/job-listing-details/job-listing-details.component';
import { JobListingModalComponent } from './components/job-listing-modal/job-listing-modal.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'jobListing/:id', component: JobListingDetailsComponent},
  {path: 'jobListingBrowse', component: JobListingBrowseComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'listing/:type', component: JobListingModalComponent},
  {path: 'listing/:type/:id', component: JobListingModalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
