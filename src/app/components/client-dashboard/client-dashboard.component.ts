import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CarteService } from '../../services/carte.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: false,
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {

  user: any = null;
  carte: any = null;

  montant = 0;
  loading = false;
  message = '';
  error = '';

  constructor(private auth: AuthService, private carteService: CarteService) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    if (this.user) {
      this.getCarte();
    }
  }

  getCarte() {
    this.carteService.getAll().subscribe({
      next: (data) => {
        this.carte = data.find((c: any) => c.utilisateur_id === this.user.id);
      }
    });
  }

  recharger() {
    if (!this.carte) return;

    if (!this.montant || this.montant <= 0) {
      this.error = 'Veuillez saisir un montant valide.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    // 🔁 Maintenant, on passe par PayTech
    this.carteService.initierRechargePaytech(this.carte.id, this.montant)
      .subscribe({
        next: (res: any) => {
          this.loading = false;

          if (res?.redirect_url) {
            // Redirection vers la page de paiement PayTech
            window.location.href = res.redirect_url;
          } else {
            this.error = 'Lien de paiement introuvable.';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Erreur lors de l’initiation du paiement.';
        }
      });
  }
}