import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http'; 

import { InputBase, TextInput } from '../unit-signup/dynamic-signup-form/input-base'; 

@Injectable()
export class UnitService {

  constructor(private http: HttpClient) { }

  getUnitsForUser() {
  	const getUnitsUrl = 'http://localhost:3000/account/units'
  	return this.http.get(getUnitsUrl);
  }

  getUnitById(id: string) {
    const getUnitByIdUrl = 'http://localhost:3000/units/' + id;
    return this.http.get(getUnitByIdUrl);
  }

  getSignUpInputsFor(unit): InputBase<any>[] {
    let inputs: InputBase<any>[] = [];

    let i = 0;
    for (const unitRequiredPlatforms of unit.platforms) {
      i++;
      inputs.push(new TextInput({
        key: unitRequiredPlatforms.platform,
        label: unitRequiredPlatforms.platform,
        value: unitRequiredPlatforms.retrieval_param || '',
        required: true, // TODO: setup required vs not required in unit setup and save to unit model
        order: i
      }));
    }

    return inputs.sort((a,b) => a.order - b.order); 
  }

}
