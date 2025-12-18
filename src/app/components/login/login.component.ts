import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string = '';
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  login() {
    if (this.form.invalid) return;

    this.errorMessage = '';
    this.loading = true;

    this.auth.login(this.form.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.auth.saveToken(res.token);
        this.auth.saveUser(res.user);
      	localStorage.setItem('role', res.user.role);

        const role = res.user.role;
         
        if (role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } 
        else if (role === 'gestionnaire') {
          this.router.navigate(['/gestionnaire-dashboard']);
        }
        else if (role === 'client') {
          this.router.navigate(['/client-dashboard']);
        }
        else {
          this.router.navigate(['/']);
        }

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