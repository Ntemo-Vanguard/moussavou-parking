import { Component, OnInit } from '@angular/core';
import { CarteService } from '../../services/carte.service';

@Component({
  selector: 'app-cartes',
  standalone: false,
  templateUrl: './cartes.component.html',
  styleUrls: ['./cartes.component.css']
})
export class CartesComponent implements OnInit {
  cartes: any[] = [];
  selectedCarte: any = null;

  montantRecharge: number | null = null;
  moyen: string = 'cash';

  loading = false;
  errorMessage = '';
  filterStatut: string = 'all'; // all | active | bloquee

  constructor(private carteService: CarteService) {}

  ngOnInit(): void {
    this.getCartes();
  }

  getCartes() {
    this.carteService.getAll().subscribe(data => this.cartes = data);
  }

  get filteredCartes() {
    if (this.filterStatut === 'all') return this.cartes;
    return this.cartes.filter(c => c.statut === this.filterStatut);
  }

  annuler() {
    this.selectedCarte = null;
    this.montantRecharge = null;
    this.errorMessage = '';
  }

  selectCarte(carte: any) {
    // Si on clique sur "Recharger" d'une carte déjà sélectionnée → on referme
    if (this.selectedCarte && this.selectedCarte.id === carte.id) {
      this.annuler();
      return;
    }

    this.selectedCarte = carte;
    this.montantRecharge = null;
    this.errorMessage = '';
  }

  recharger() {
    if (!this.selectedCarte) return;

    if (!this.montantRecharge || this.montantRecharge <= 0) {
      this.errorMessage = 'Veuillez saisir un montant valide.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.carteService.recharger(this.selectedCarte.id, {
      montant: this.montantRecharge,
      moyen: this.moyen || 'cash'
    }).subscribe({
      next: (updated) => {
        this.loading = false;

        // mise à jour dans la liste
        const index = this.cartes.findIndex(c => c.id === updated.id);
        if (index !== -1) {
          this.cartes[index] = updated;
        }

        // mise à jour de la carte sélectionnée
        this.selectedCarte = updated;
        this.montantRecharge = null;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la recharge.';
      }
    });
  }
}