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

  constructor(private unitService: UnitService, private router: Router) { }

  ngOnInit() {
  	this.unitService.getUnitsForUser().subscribe((res: any) => {
  		this.units = res.units;
  	});
  }

  setupNewUnit() {
  	this.router.navigate(['unit-setup']);
  }

}
