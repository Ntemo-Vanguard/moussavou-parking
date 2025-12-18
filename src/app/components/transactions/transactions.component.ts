import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  standalone: false,
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  transactions: any[] = [];

  filterType: string = 'all';   // all | recharge | paiement_parking
  filterStatut: string = 'all'; // all | en_attente | valide | echoue
  selectedTransaction: any = null;

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.getTransactions();
  }

  getTransactions() {
    this.transactionService.getAll().subscribe(data => this.transactions = data);
  }

  get filteredTransactions() {
    return this.transactions.filter(t => {
      const typeOK = this.filterType === 'all' || t.type === this.filterType;
      const statutOK = this.filterStatut === 'all' || t.statut === this.filterStatut;
      return typeOK && statutOK;
    });
  }

  selectTransaction(t: any) {
    this.selectedTransaction = { ...t }; // copie pour modification
    this.successMessage = '';
    this.errorMessage = '';
  }

  updateStatut() {
    if (!this.selectedTransaction) return;

    this.loading = true;

    this.transactionService.update(this.selectedTransaction.id, {
      statut: this.selectedTransaction.statut
    }).subscribe({
      next: (updated) => {
        this.loading = false;

        // mise à jour locale
        const index = this.transactions.findIndex(x => x.id === updated.id);
        if (index !== -1) this.transactions[index] = updated;

        this.successMessage = 'Statut mis à jour avec succès.';
        this.selectedTransaction = null;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de la mise à jour.';
      }
    });
  }

  // Helpers pour couleur dynamique
  getTypeColor(t: any) {
    return t.type === 'recharge'
      ? '#4ade80'
      : '#38bdf8';
  }

  getStatutColor(t: any) {
    return t.statut === 'valide' ? '#4ade80'
         : t.statut === 'en_attente' ? '#facc15'
         : '#f87171';
  }
}