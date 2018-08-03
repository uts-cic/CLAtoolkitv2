import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { InputBase } from '../input-base';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dynamic-form-input',
  templateUrl: './dynamic-form-input.component.html',
  styleUrls: ['./dynamic-form-input.component.css']
})
export class DynamicFormInputComponent implements OnInit {

	@Input() input: InputBase<any>;
	@Input() form: FormGroup;

	userHasTokenForPlatform: boolean;

	get isValid() { return this.form.controls[this.input.key].valid; }

  constructor(private authService: AuthService) { }

  ngOnInit() {
  	this.authService.userHasSocialMediaTokenFor(this.input.key).subscribe((res: any) => {
  		if (res.error) { console.error("Error checking whether user has sm token for platform " +
  			this.input.key + ": " + res.error); }

  		this.userHasTokenForPlatform = res.exists;
  	});
  }

}
