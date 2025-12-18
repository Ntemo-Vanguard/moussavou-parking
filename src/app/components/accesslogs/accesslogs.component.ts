import { Component, OnInit } from '@angular/core';
import { AccesslogService } from '../../services/accesslog.service';
import { ParkingService } from '../../services/parking.service';

@Component({
  selector: 'app-accesslogs',
  standalone: false,
  templateUrl: './accesslogs.component.html',
  styleUrls: ['./accesslogs.component.css']
})
export class AccesslogsComponent implements OnInit {

  accesslogs: any[] = [];
  parkings: any[] = [];

  filterStatut: string = 'all';
  filterParking: string = 'all';

  errorMessage = '';
  loading = false;

  constructor(
    private accesslogService: AccesslogService,
    private parkingService: ParkingService
  ) {}

  ngOnInit() {
    this.getLogs();
    this.getParkings();
  }

  getLogs() {
    this.accesslogService.getAll().subscribe(data => this.accesslogs = data);
  }

  getParkings() {
    this.parkingService.getAll().subscribe(data => this.parkings = data);
  }

  get filteredLogs() {
    return this.accesslogs.filter(log => {
      const statutOK = this.filterStatut === 'all' || log.statut === this.filterStatut;
      const parkingOK = this.filterParking === 'all' || log.parking_id == this.filterParking;
      return statutOK && parkingOK;
    });
  }
}