import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://vps-eadfdcc9.vps.ovh.net/api';

  constructor(private http: HttpClient, private router: Router) {}

  // Inscription : uniquement pour les clients
  register(data: { nom: string; email: string; telephone: string; mot_de_passe: string; }) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(user: { email: string, mot_de_passe: string }) {
    return this.http.post(`${this.baseUrl}/login`, user);
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  me() {
    return this.http.get(`${this.baseUrl}/me`);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isGestionnaire(): boolean {
    return this.getRole() === 'gestionnaire';
  }

  isClient(): boolean {
    return this.getRole() === 'client';
  }

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }
}