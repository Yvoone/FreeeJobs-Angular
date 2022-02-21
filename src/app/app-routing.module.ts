import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JobListingBrowseComponent } from './components/job-listing-browse/job-listing-browse.component';
import { JobListingDetailsComponent } from './components/job-listing-details/job-listing-details.component';
import { JobListingModalComponent } from './components/job-listing-modal/job-listing-modal.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {path: '', component: DashboardComponent, canActivate: [ AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent , canActivate: [ AuthGuard]},
  {path: 'jobListing/:id', component: JobListingDetailsComponent},
  {path: 'jobListingBrowse', component: JobListingBrowseComponent, canActivate: [ AuthGuard] },
  {path: 'profile', component: ProfileComponent, canActivate: [ AuthGuard]},
  {path: 'listing/:type', component: JobListingModalComponent},
  {path: 'listing/:type/:id', component: JobListingModalComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
