import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gestionnaire-dashboard',
  standalone: false,
  templateUrl: './gestionnaire-dashboard.component.html',
  styleUrl: './gestionnaire-dashboard.component.css'
})
export class GestionnaireDashboardComponent implements OnInit {
  user: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
  }

}