import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http'; 

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
	jwt = new JwtHelperService();

  user = undefined;

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(formData, done) {
  	const registerUrl = 'http://localhost:3000/auth/register/';

  	delete formData.passwordConf;

  	this.http.post(registerUrl, { form: formData }).subscribe((res: any) => {
  		if (res.status == 401) { done(res); }

  		if (res.token) {
  			const decoded = this.jwt.decodeToken(res.token);
  			this.user = decoded;
  			localStorage.setItem('clatk-token', res.token);
  			this.router.navigate(['/home']);
  			// done(undefined);
  		}
  	})
  }

  loginUser(formData, done) {
  	const loginUrl = 'http://localhost:3000/auth/login/';

  	delete formData.passwordConf;

  	this.http.post(loginUrl, { form: formData }).subscribe((res: any) => {
  		if (res.status == 401) { done(res); }

  		if (res.token) {
  			const decoded = this.jwt.decodeToken(res.token);
  			this.user = decoded;
  			localStorage.setItem('clatk-token', res.token);
  			this.router.navigate(['/home']);
  			// done(undefined);
  		}
  	});
  }

  isLoggedIn() {
  	const token = localStorage.getItem('clatk-token');

  	if (token) {
  		const decoded = this.jwt.decodeToken(token);
  		this.user = decoded;

  		// TODO: SETUP EXPIRY ON BACKEND
  		// console.log("isLoggedIn: !this.jwt.isTokenExpired(token): ", !this.jwt.isTokenExpired(token));
  		// return !this.jwt.isTokenExpired(token);
  		return true;
  	}

  	return false;
  }

  getUser() {
  	return this.user;
  }


}
