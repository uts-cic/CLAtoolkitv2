import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InputBase } from './dynamic-signup-form/input-base';

import { UnitService } from '../services/unit.service';

@Component({
  selector: 'app-unit-signup',
  templateUrl: './unit-signup.component.html',
  styleUrls: ['./unit-signup.component.css']
})
export class UnitSignupComponent implements OnInit {

	unit;
	inputs: InputBase<any>[] = [];

  constructor(private router: Router, private route: ActivatedRoute,
  	private unitService: UnitService) { }

  ngOnInit() {
  	const unitId = this.route.snapshot.params.unitId;
  	// console.log("this.route.snapshot.params: ", this.route.snapshot.params);
  	this.unitService.getUnitById(unitId).subscribe((res: any) => {
  		if (res.error) { console.error("There was an error retreiving unit with id: " + unitId); }

  		this.unit = res.unit;

  		console.log("GOT UNITS: ", this.unit);

  		this.inputs = this.unitService.getSignUpInputsFor(this.unit);
  	});

  	
  }

}
