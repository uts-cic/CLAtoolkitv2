import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { LrsModel } from '../../../models/LrsModel';

@Component({
  selector: 'app-custom-lrs-form',
  templateUrl: './custom-lrs-form.component.html',
  styleUrls: ['./custom-lrs-form.component.css']
})
export class CustomLrsFormComponent implements OnInit {

	@Output() added = new EventEmitter<LrsModel>();
	lrsFormModel = {
		name: '',
		endpoint: '',
		config: {
			basic_auth: {
				key: '',
				secret: ''
			},
			token: ''
		},
		auth_type: '',
		lrs_type: 'custom'
	};

	showBasicAuthForm: boolean = false;
	showTokenAuthForm: boolean = false;


  constructor() { }

  ngOnInit() {
  }

  toggleBasicAuthForm() {
  	this.showBasicAuthForm = !this.showBasicAuthForm;
  	this.showTokenAuthForm = false;
  }

  toggleTokenAuthForm() {
  	this.showTokenAuthForm = !this.showTokenAuthForm;
  	this.showBasicAuthForm = false;
  }

  addLrs() {
  	(this.lrsFormModel.config.token == '') ? this.lrsFormModel.auth_type = "basic_auth" : "token";

  	this.added.emit(this.lrsFormModel);
  	this.lrsFormModel = {
			name: '',
			endpoint: '',
			config: {
				basic_auth: {
					key: '',
					secret: ''
				},
				token: ''
			},
			auth_type: '',
			lrs_type: 'custom'
		};
  }

}
