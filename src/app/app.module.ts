import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GestionnaireDashboardComponent } from './components/gestionnaire-dashboard/gestionnaire-dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { UtilisateursComponent } from './components/utilisateurs/utilisateurs.component';
import { CartesComponent } from './components/cartes/cartes.component';
import { ParkingsComponent } from './components/parkings/parkings.component';
import { AccesslogsComponent } from './components/accesslogs/accesslogs.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { XofPipe } from './pipes/xof.pipe';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel.component';
import { ParkingStatusComponent } from './components/parking-status/parking-status.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ClientDashboardComponent,
    AdminDashboardComponent,
    GestionnaireDashboardComponent,
    NavbarComponent,
    FooterComponent,
    UtilisateursComponent,
    CartesComponent,
    ParkingsComponent,
    AccesslogsComponent,
    TransactionsComponent,
    XofPipe,
    PaymentSuccessComponent,
    PaymentCancelComponent,
    ParkingStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
