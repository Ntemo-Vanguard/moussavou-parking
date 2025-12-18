import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParkingService } from '../../services/parking.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { PlaceService } from '../../services/place.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-parkings',
  standalone: false,
  templateUrl: './parkings.component.html',
  styleUrls: ['./parkings.component.css']
})
export class ParkingsComponent implements OnInit {

  parkings: any[] = [];
  gestionnaires: any[] = [];
  places: any[] = []; // places du parking sélectionné uniquement
  parkingForm!: FormGroup;
  selectedParkingId: number | null = null;
  errorMessage = '';
  loading = false;
  role: string | null = null;
  user: any = null;

  constructor(
    private fb: FormBuilder,
    private parkingService: ParkingService,
    private utilisateurService: UtilisateurService,
    private placeService: PlaceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.user = this.authService.getUser();

    this.initForm();
    this.getParkings();
    if (this.role === 'admin') {
       this.getGestionnaires(); // un gestionnaire ne peut voir des gestionnaires
    }
  }

  initForm() {
    this.parkingForm = this.fb.group({
      nom: ['', Validators.required],
      localisation: ['', Validators.required],
      capacite: [1, [Validators.required, Validators.min(1)]],
      gestionnaire_id: [null]
    });
  }

  getParkings() {
    this.parkingService.getAll().subscribe({
      next: (data) => {
        if (this.role === 'admin') {
          this.parkings = data;
        }
        else if (this.role === 'gestionnaire') {
          const id = this.user?.id;
          this.parkings = data.filter((p: any) => p.gestionnaire_id === id);
        }
      },
      error: () => this.errorMessage = 'Erreur lors du chargement des parkings.'
    });
  }


  getGestionnaires() {
    this.utilisateurService.getAll().subscribe({
      next: (users) =>
        this.gestionnaires = users.filter((u: any) => u.role === 'gestionnaire')
    });
  }

  save() {
    if (this.parkingForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    const formData = this.parkingForm.value;

    if (this.selectedParkingId) {
      this.parkingService.update(this.selectedParkingId, formData).subscribe({
        next: (parking) => {
          this.loading = false;
          this.getParkings();
          this.selectParking(parking); // recharge les places mises à jour
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour.';
        }
      });
    } else {
      this.parkingService.create(formData).subscribe({
        next: (parking) => {
          this.loading = false;
          this.getParkings();
          this.resetForm();
          this.selectParking(parking);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la création.';
        }
      });
    }
  }

  edit(parking: any) {
    this.selectedParkingId = parking.id;

    this.parkingForm.patchValue({
      nom: parking.nom,
      localisation: parking.localisation,
      capacite: parking.capacite,
      gestionnaire_id: parking.gestionnaire_id
    });

    this.selectParking(parking);
  }

  delete(parking: any) {
    if (!confirm('Supprimer ce parking et toutes ses places ?')) return;

    this.parkingService.delete(parking.id).subscribe({
      next: () => {
        this.selectedParkingId = null;
        this.places = [];
        this.getParkings();
        this.resetForm();
      },
      error: () => this.errorMessage = 'Erreur lors de la suppression.'
    });
  }

  resetForm() {
    this.parkingForm.reset({
      nom: '',
      localisation: '',
      capacite: 1,
      gestionnaire_id: null
    });

    this.selectedParkingId = null;
    this.errorMessage = '';
    this.places = [];
  }

  selectParking(parking: any) {
    this.selectedParkingId = parking.id;
    this.places = parking.places || [];
  }

  updatePlace(place: any) {
    const data = {
      code_capteur: place.code_capteur
    };

    this.placeService.update(place.id, data).subscribe({
      next: (updated) => {
        const i = this.places.findIndex(p => p.id === place.id);
        if (i !== -1) this.places[i] = updated;
      },
      error: () => this.errorMessage = 'Erreur lors de la modification de la place.'
    });
  }

}