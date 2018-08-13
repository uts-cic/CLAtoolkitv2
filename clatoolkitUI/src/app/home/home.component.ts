import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnitService } from '../services/unit.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	units = [];
  loadingUnits: boolean;

  constructor(private unitService: UnitService, private router: Router) { }

  ngOnInit() {
    this.loadingUnits = true;
  	this.unitService.getUnitsForUser().subscribe((res: any) => {
      this.units = res;
      this.loadingUnits = false;
      console.log("GOT UNITS: ", this.units);
  	});
  }

  setupNewUnit() {
    this.unitService.prepareNewUnit();
  	this.router.navigate(['unit/unit-setup']);
  }

}
