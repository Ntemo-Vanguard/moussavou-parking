import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateurs',
  standalone: false,
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})
export class UtilisateursComponent implements OnInit {
  utilisateurs: any[] = [];
  userForm!: FormGroup;
  selectedId: number | null = null;
  loading = false;
  errorMessage = '';
  roles = ['admin', 'gestionnaire'];
  filterRole: string = 'all';

  constructor(
    private fb: FormBuilder,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getUtilisateurs();
  }

  initForm() {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.maxLength(150)]],
      role: ['gestionnaire', Validators.required],
      mot_de_passe: ['', [Validators.minLength(4)]], // requis en création seulement
    });
  }

  getUtilisateurs() {
    this.utilisateurService.getAll().subscribe(data => {
      this.utilisateurs = data.filter((u: any) => u.id !== 1);
    });
  }

  get filteredUtilisateurs() {
    if (this.filterRole === 'all') return this.utilisateurs;
    return this.utilisateurs.filter(u => u.role === this.filterRole);
  }

  save() {
    if (this.userForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    const data = { ...this.userForm.value };

    // En mode modification : si mot_de_passe vide, on ne l’envoie pas
    if (this.selectedId && !data.mot_de_passe) {
      delete data.mot_de_passe;
    }

    if (this.selectedId) {
      this.utilisateurService.update(this.selectedId, data).subscribe({
        next: () => {
          this.loading = false;
          this.getUtilisateurs();
          this.resetForm();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour.';
        }
      });
    } else {
      // Création : mot_de_passe obligatoire
      if (!data.mot_de_passe) {
        this.loading = false;
        this.errorMessage = 'Le mot de passe est requis pour la création.';
        return;
      }

      this.utilisateurService.create(data).subscribe({
        next: () => {
          this.loading = false;
          this.getUtilisateurs();
          this.resetForm();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la création.';
        }
      });
    }
  }

  edit(user: any) {
    this.selectedId = user.id;

    this.userForm.patchValue({
      nom: user.nom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      is_blocked: user.is_blocked,
      mot_de_passe: '' // on ne pré-remplit jamais un mot de passe
    });
  }

  toggleBlock(user: any) {
    const newStatus = !user.is_blocked;

    this.utilisateurService.update(user.id, { is_blocked: newStatus }).subscribe({
      next: (updated) => {
        user.is_blocked = updated.is_blocked;
      },
      error: () => {
        alert("Erreur lors de la mise à jour du statut.");
      }
    });
  }

  resetForm() {
    this.userForm.reset({
      role: 'gestionnaire'
    });

    if (this.userForm.contains('is_blocked')) {
      this.userForm.removeControl('is_blocked');
    }
    this.selectedId = null;
  }
}