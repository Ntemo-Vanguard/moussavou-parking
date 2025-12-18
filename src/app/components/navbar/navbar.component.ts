import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  menuAdminOpen = false;
  menuGestOpen = false;
  menuClientOpen = false;

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  // ⬇️ GETTERS = mise à jour automatique sans recharger
  get user() {
    return this.auth.getUser();
  }
  get role() {
    return this.auth.getRole();
  }
  get isAuth() {
    return this.auth.isAuthenticated();
  }

  toggleAdmin() { this.menuAdminOpen  = !this.menuAdminOpen; }
  toggleGest()  { this.menuGestOpen   = !this.menuGestOpen; }
  toggleClient(){ this.menuClientOpen = !this.menuClientOpen; }

  logout() {
    this.auth.removeToken();

    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });

    this.menuAdminOpen = this.menuGestOpen = this.menuClientOpen = false;
  }
}