import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

	formModel = {
		email: undefined,
		password: undefined,
		passwordConf: undefined,
		validate: () => {
			if (this.formModel.password != this.formModel.passwordConf) {
				this.formModel.errors = 'Passwords do not match';
				return false;
			} 

			return true;
		},
		errors: undefined
	}

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  registerSubmit() {
  	if (!this.formModel.validate()) {
  		console.error("Error occurred registering user: ", this.formModel.errors);
  	} else {
  		this.authService.registerUser(this.formModel, (err: any) => {
  			if (err) { console.error("Error occurred registering user: ", err); }
  		});
  	}
  }

  loginSubmit() {
  	this.authService.loginUser(this.formModel, (err: any) => {
  		if (err) { console.error("Error occurred logging in: ", err); }
  	});
  }

}

