import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

	formModel = {
		email: undefined,
		password: undefined,
		errors: undefined
	}

  formModelRegister = {
    email: undefined,
    password: undefined,
    passwordConf: undefined,
    validate: () => {
      if (this.formModelRegister.password != this.formModelRegister.passwordConf) {
        this.formModel.errors = 'Passwords do not match';
        return false;
      } 

      return true;
    },
    errors: undefined
  }

  showLogin: boolean;
  showRegister: boolean;



  nextRoute: string;

  constructor(private authService: AuthService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    // console.log('this.activeRoute.snapshot.params: ', this.activeRoute.snapshot.params);
    const userTok = this.activeRoute.snapshot.paramMap.get("user");

    if (userTok) {
	    this.authService.storeToken(userTok);
    }

    this.activeRoute.queryParams.subscribe(params => {

      this.nextRoute = params.next;
    });

    this.showLogin = false;
    this.showRegister = false;
  }

  showLoginForm() {
    this.showLogin = true;
  }

  showRegisterForm() {
    this.showRegister = true;
  }

  backForm() {
    this.showLogin = false;
    this.showRegister = false;
  }

  registerSubmit() {
  	if (!this.formModelRegister.validate()) {
  		console.error("Error occurred registering user: ", this.formModelRegister.errors);
  	} else {
  		this.authService.registerUser(this.formModelRegister, this.nextRoute, (err: any) => {
  			if (err) { console.error("Error occurred registering user: ", err); }
  		});
  	}
  }

  loginSubmit(aafLogin: boolean) {
    // console.log(this.formModel);
    if (!aafLogin) {
      this.authService.loginUser(this.formModel, this.nextRoute, (err: any) => {
        if (err) { console.error("Error occurred logging in: ", err); }
      });
    } else {
      // redirect to AAF login
      window.location.href = environment.AAF_url;
    }

  }

}

