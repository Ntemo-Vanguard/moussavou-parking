import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private apiUrl = 'https://vps-eadfdcc9.vps.ovh.net/api/dashboard';

  constructor(private http: HttpClient) {}

  getParkingsStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/parkings`);
  }
}