import { Injectable } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputBase } from './input-base';

@Injectable()
export class DynamicFormService {

  constructor() { }

  toFormGroup(inputs: InputBase<any>[]) {
  	let group: any = [];

  	inputs.forEach(input => {
  		if (input.key == 'twitter') {
  			group[input.key] = new FormControl({ value: input.value || '', disabled: true});
  		} else {
  			group[input.key] = input.required ? new FormControl(input.value || '', Validators.required) :
  											new FormControl(input.value || '');
  		}

  	});

  	return new FormGroup(group);
  }

}
