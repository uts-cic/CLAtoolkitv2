import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-units-list',
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.css']
})
export class UnitsListComponent implements OnInit {

	@Input() unit;
	showRegistrationLink: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleRegisterLink(): void {
  	this.showRegistrationLink = !this.showRegistrationLink;
  }

  getRegistrationLink(unitId: string): string {
  	const url = 'http://localhost:4200/unit-signup/' + unitId;
  	return url;
  }





}
