import { Component, OnInit, Input } from '@angular/core';

import { FormGroup } from '@angular/forms';

import { InputBase } from './input-base';
import { DynamicFormService } from './dynamic-form.service';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'app-dynamic-signup-form',
  templateUrl: './dynamic-signup-form.component.html',
  styleUrls: ['./dynamic-signup-form.component.css'],
  providers: [ DynamicFormService ]
})
export class DynamicSignupFormComponent implements OnInit {
	
	@Input() inputs: InputBase<any>[] = [];
	form: FormGroup;


  constructor(private dfs: DynamicFormService, private unitService: UnitService) { }

  ngOnInit() {
  	console.log("INPUT inputs: ", this.inputs);
  	this.form = this.dfs.toFormGroup(this.inputs);
  }

  submitSignUpForm() {
  	// this.unitService.registerUserSignup(this.form.value);
  	console.log(JSON.stringify(this.form.value));
  	this.unitService.registerUser(this.form.value);
  }



}
