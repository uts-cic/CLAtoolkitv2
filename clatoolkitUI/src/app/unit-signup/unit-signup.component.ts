import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InputBase } from './dynamic-signup-form/input-base';

import { UnitService } from '../services/unit.service';
import { DynamicFormService } from './dynamic-signup-form/dynamic-form.service';

@Component({
  selector: 'app-unit-signup',
  templateUrl: './unit-signup.component.html',
  styleUrls: ['./unit-signup.component.css']
})
export class UnitSignupComponent implements OnInit {

	unit;
	inputs: InputBase<any>[] = [];
	loading: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute,
  	private unitService: UnitService, private formService: DynamicFormService) { }

  ngOnInit() {
  	const unitId = this.route.snapshot.params.unitId;
  	// console.log("this.route.snapshot.params: ", this.route.snapshot.params);
    this.unitService.setSelectedUnit(unitId);
  	this.unitService.getUnitById(unitId).subscribe((res: any) => {
  		if (res.error) { console.error("There was an error retreiving unit with id: " + unitId); }

  		this.unit = res.unit;

  		this.formService.getSignUpInputsFor(this.unit).then((inputs: InputBase<any>[]) => {
  			this.inputs = inputs;
  			this.loading = false;
  		});
  	});

  	
  }

}
