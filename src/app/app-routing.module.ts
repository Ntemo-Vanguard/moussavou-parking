import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UtilisateursComponent } from './components/utilisateurs/utilisateurs.component';
import { ParkingsComponent } from './components/parkings/parkings.component';
import { CartesComponent } from './components/cartes/cartes.component';
import { AccesslogsComponent } from './components/accesslogs/accesslogs.component';
import { AuthGuard } from './auth.guard';
import { NoAuthGuard } from './no-auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GestionnaireDashboardComponent } from './components/gestionnaire-dashboard/gestionnaire-dashboard.component';
import { ParkingStatusComponent } from './components/parking-status/parking-status.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },

  { path: 'client-dashboard', component: ClientDashboardComponent, canActivate: [AuthGuard], data: { expectedRoles: ['client'] } },
  { path: 'gestionnaire-dashboard', component: GestionnaireDashboardComponent, canActivate: [AuthGuard], data: { expectedRoles: ['gestionnaire'] } },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { expectedRoles: ['admin'] } },

  // 🔒 CRUD utilisateurs (admin only)
  { path: 'utilisateurs', component: UtilisateursComponent, canActivate: [AuthGuard], data: { expectedRoles: ['admin'] } },
  
  { path: 'parkings', component: ParkingsComponent, canActivate: [AuthGuard], data: { expectedRoles: ['admin','gestionnaire'] } },
  { path: 'cartes', component: CartesComponent, canActivate: [AuthGuard], data: { expectedRoles: ['admin','gestionnaire'] } },
  { path: 'accesslogs', component: AccesslogsComponent, canActivate: [AuthGuard], data: { expectedRoles: ['admin','gestionnaire'] } },

  { path: 'etat-parkings', component: ParkingStatusComponent },

  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment-cancel', component: PaymentCancelComponent },
  
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}