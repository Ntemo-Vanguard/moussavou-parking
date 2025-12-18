import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.auth.removeToken();
      this.router.navigate(['/login']);
    });
  }
}