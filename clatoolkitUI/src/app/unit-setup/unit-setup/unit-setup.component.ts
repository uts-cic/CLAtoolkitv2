import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unit-setup',
  templateUrl: './unit-setup.component.html',
  styleUrls: ['./unit-setup.component.css']
})
export class UnitSetupComponent implements OnInit {

	unitFormModelStep1 = {
		name: undefined,
		code: undefined,
		semester: undefined,
		description: undefined,

		startDate: undefined,
		endDate: undefined,

		ethicsStatement: undefined
	}

  constructor() { }

  ngOnInit() {
  }

}
