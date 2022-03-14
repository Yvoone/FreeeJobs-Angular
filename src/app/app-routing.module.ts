import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JobListingBrowseComponent } from './components/job-listing-browse/job-listing-browse.component';
import { JobListingDetailsComponent } from './components/job-listing-details/job-listing-details.component';
import { JobListingModalComponent } from './components/job-listing-modal/job-listing-modal.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './services/auth.guard';
import { RegisterComponent } from "./components/register/register.component";
import { AdminComponent } from "./components/admin/admin.component";
import { PageNotFoundComponent } from './components/common/page-not-found/page-not-found.component';
import { AccessDeniedComponent } from './components/common/access-denied/access-denied.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, canActivate: [ AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent , canActivate: [ AuthGuard]},
  {path: 'jobListing/details', component: JobListingDetailsComponent, canActivate: [ AuthGuard]},
  {path: 'jobListingBrowse', component: JobListingBrowseComponent, canActivate: [ AuthGuard] },
  {path: 'profile', component: ProfileComponent, canActivate: [ AuthGuard]},
  {path: 'applicantProfile', component: ProfileComponent, canActivate: [ AuthGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [ AuthGuard]},
  {path: 'listing/:type', component: JobListingModalComponent, canActivate: [ AuthGuard]},
  {path: 'pageNotFound', component: PageNotFoundComponent},
  {path: 'accessDenied', component: AccessDeniedComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
