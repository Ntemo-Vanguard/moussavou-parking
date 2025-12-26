import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
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
  displayedSolde: number = 0;     // solde animé
  private refreshSub?: Subscription;


  montant = 0;
  loading = false;
  message = '';
  error = '';

  constructor(private auth: AuthService, private carteService: CarteService) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    if (this.user) {
      this.getCarte(true);

      // 🔁 Rafraîchissement automatique toutes les 10 secondes
      this.refreshSub = interval(10000).subscribe(() => {
        this.getCarte(false);
      });
    }
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  getCarte(initial = false) {
    this.carteService.getAll().subscribe({
      next: (data) => {
        const newCarte = data.find((c: any) => c.utilisateur_id === this.user.id);
        if (!newCarte) return;

        const newSolde = Number(newCarte.solde);
        const oldSolde = Number(this.displayedSolde);

        // Premier chargement
        if (initial || !this.carte) {
          this.carte = newCarte;
          this.displayedSolde = newSolde;
          return;
        }

        // 🔥 Animation UNIQUEMENT si valeurs valides
        if (!Number.isNaN(newSolde) && !Number.isNaN(oldSolde) && newSolde !== oldSolde) {
          this.animateSolde(oldSolde, newSolde);
        }

        this.carte = newCarte;
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

  animateSolde(from: number, to: number) {
    // Sécurité absolue
    from = Number(from);
    to   = Number(to);

    if (Number.isNaN(from) || Number.isNaN(to)) {
      this.displayedSolde = to;
      return;
    }

    const duration = 1200; // animation bien visible
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // 🎰 easing type "roulette"
      const eased = 1 - Math.pow(1 - progress, 4);

      const current = from + (to - from) * eased;

      // IMPORTANT : arrondi progressif (pas floor brutal)
      this.displayedSolde = Math.round(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.displayedSolde = to; // verrou final
      }
    };

    requestAnimationFrame(animate);
  }


}