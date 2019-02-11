import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http'; 
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputBase, TextInput, DropDownInput } from './input-base'; 

import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Injectable()
export class DynamicFormService {

	private socialMediaInputMap = {
		'trello': 'dropdown',
		'github': 'dropdown',
		'slack': 'dropdown',
		'twitter': 'text',
	}

  constructor(private http: HttpClient, private authService: AuthService) { }

  toFormGroup(inputs: InputBase<any>[]) {
  	let group: any = [];

  	console.log('inputs ', inputs);

  	inputs.forEach(input => {
  		if (input.key == 'twitter') {

        if (input.value.split(",").length > 1) {
          const inputsAsHashtag = [];
          input.value.split(",").forEach((hashtag) => {
            inputsAsHashtag.push("#"+hashtag);
          });

          input.value = inputsAsHashtag.join(",");
        } else {
          input.value = "#" + input.value;
        }

  			group[input.key] = new FormControl({ value: input.value || '', disabled: true}, Validators.nullValidator);
  		} else {
  			group[input.key] = input.required ? new FormControl(input.value || '', Validators.required) :
  											new FormControl(input.value || '');
  		}

  	});

  	return new FormGroup(group);
  }

async getSignUpInputsFor(unit) {//: Observable<InputBase<any>[]> {
    let inputs: InputBase<any>[] = [];

    let i = 0;
    for (const unitRequiredPlatforms of unit.platforms) {
      i++;
      const platformName = unitRequiredPlatforms.platform; // twitter, slack, trello, etc

      if (this.socialMediaInputMap[platformName] == 'text') {
      	inputs.push(new TextInput({
	        key: unitRequiredPlatforms.platform,
        	label: unitRequiredPlatforms.platform,
        	value: unitRequiredPlatforms.retrieval_param || '',
        	required: false, // TODO: setup required vs not required in unit setup and save to unit model
        	order: i
      	}));
      }

      if (this.socialMediaInputMap[platformName] == 'dropdown') {
      	// Check to see if user has attached this platform
      	// if so, retreive options from backend
      	let options = undefined;
      	if (await this.authService.asyncUserHasSocialMediaTokenFor(platformName)) {
      		options = await this.authService.getSocialMediaOptionsForUser(platformName);
      	}

      	console.log("DROPDOWN OPTIONS: ", options);

      	inputs.push(new DropDownInput({
      		key: unitRequiredPlatforms.platform,
      		label: unitRequiredPlatforms.platform,
      		options: options,
          required: unitRequiredPlatforms.required,
      		order: i
      	}));
      }
    }

    return inputs.sort((a,b) => a.order - b.order); 
  }


  /*doSocialAuth(platform: string) {
  	this.http.get('http://localhost:3000/social/' + platform);
  }*/
}
