import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-parking-status',
  standalone: false,
  templateUrl: './parking-status.component.html',
  styleUrls: ['./parking-status.component.css']
})
export class ParkingStatusComponent implements OnInit {

  parkings: any[] = [];
  filteredParkings: any[] = [];
  localisations: string[] = [];
  selectedLocalisation = '';

  private initialized = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getParkings();

    // 🔁 Rafraîchissement temps réel simple (polling)
    setInterval(() => this.getParkings(), 5000);
  }

  getParkings() {
    this.dashboardService.getParkingsStatus().subscribe({
      next: (data) => {
        this.parkings = data;
        this.extraireLocalisations();
        if (!this.initialized && this.localisations.length > 0) {
          this.selectedLocalisation = this.localisations[0];
          this.initialized = true;
        }
        this.appliquerFiltre();
      }
    });
  }

  extraireLocalisations() {
    this.localisations = [
      ...new Set(this.parkings.map(p => p.localisation))
    ];
  }

  appliquerFiltre() {
    if (!this.selectedLocalisation) {
      this.filteredParkings = this.parkings;
    } else {
      this.filteredParkings = this.parkings.filter(
        p => p.localisation === this.selectedLocalisation
      );
    }
  }

  countFree(places: any[]) {
    return places.filter(p => p.statut === 'libre').length;
  }

  countBusy(places: any[]) {
    return places.filter(p => p.statut === 'occupee').length;
  }
}