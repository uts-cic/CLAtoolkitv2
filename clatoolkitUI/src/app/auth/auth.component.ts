import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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



  nextRoute: string;

  constructor(private authService: AuthService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    console.log('this.activeRoute.snapshot.params: ', this.activeRoute.snapshot.params);
    this.activeRoute.queryParams.subscribe(params => {
      console.log('params: ', params);

      this.nextRoute = params.next;
    });
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

  loginSubmit() {
    console.log(this.formModel);
  	this.authService.loginUser(this.formModel, this.nextRoute, (err: any) => {
  		if (err) { console.error("Error occurred logging in: ", err); }
  	});
  }

}

