import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: FormGroup;
  errorMessage: string = '';
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      mot_de_passe: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  register() {
    if (this.form.invalid) return;

    this.errorMessage = '';
    this.loading = true;

    this.auth.register(this.form.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: err => {
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = err.error?.error || err.error?.message || 'Erreur inconnue';
        } else if (err.status === 422) {
          this.errorMessage = 'Champs invalides. Vérifiez le formulaire.';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }
}