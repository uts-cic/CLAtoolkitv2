import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UnitService } from "../../services/unit.service";

import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-units-list',
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.css']
})
export class UnitsListComponent implements OnInit {

	@Input() unit;
	showRegistrationLink: boolean = false;

  constructor(private unitService: UnitService, private router: Router) { }

  ngOnInit() {
  }

  toggleRegisterLink(): void {
  	this.showRegistrationLink = !this.showRegistrationLink;
  }

  getRegistrationLink(unitId: string): string {
  	const url = environment.frontend_host + 'unit-signup/' + unitId;
  	return url;
  }

  importNow() {
    this.unitService.importForUnit(this.unit._id);
  }

  editUnit(): void {
    this.router.navigate(['/edit/' + this.unit._id]);
  }





}
