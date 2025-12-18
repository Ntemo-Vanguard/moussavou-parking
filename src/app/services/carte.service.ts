import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarteService {
  private apiUrl = 'https://vps-eadfdcc9.vps.ovh.net/api/cartes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  recharger(id: number, data: { montant: number; moyen?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/recharger`, data);
  }

  initierRechargePaytech(carteId: number, montant: number) {
    return this.http.post('http://localhost:8000/api/paytech/init', {
      carte_id: carteId,
      montant: montant
    });
  }
}