import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http'; 

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
	jwt = new JwtHelperService();

  user = undefined;

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(formData, nextRoute, done) {
  	const registerUrl = 'http://localhost:3000/auth/register/';

  	delete formData.passwordConf;

  	this.http.post(registerUrl, { form: formData }).subscribe((res: any) => {
  		if (res.status == 401) { done(res); }

  		if (res.token) {
  			const decoded = this.jwt.decodeToken(res.token);
  			this.user = decoded;
  			localStorage.setItem('clatk-token', res.token);
  			this.router.navigate([nextRoute]);
  			// done(undefined);
  		}
  	})
  }

  loginUser(formData, nextRoute, done) {
  	const loginUrl = 'http://localhost:3000/auth/login/';

  	delete formData.passwordConf;

  	this.http.post(loginUrl, { form: formData }).subscribe((res: any) => {
  		if (res.status == 401) { done(res); }

  		if (res.token) {
  			const decoded = this.jwt.decodeToken(res.token);
  			this.user = decoded;
  			localStorage.setItem('clatk-token', res.token);
  			this.router.navigate([nextRoute]);
  			// done(undefined);
  		}
  	});
  }


  // TODO: Refactor social media stuff to seperate service
  userHasSocialMediaTokenFor(socialMediaPlatform: string) {
    const userSocialMediaTokenUrl = 'http://localhost:3000/auth/tokenCheck/';
    return this.http.post(userSocialMediaTokenUrl, { platform: socialMediaPlatform });
  }

  async asyncUserHasSocialMediaTokenFor(socialMediaPlatform: string) {
    const userSocialMediaTokenUrl = 'http://localhost:3000/auth/tokenCheck/';
    return this.http.post(userSocialMediaTokenUrl, { platform: socialMediaPlatform }).toPromise()
      .then((res: any) => {
        if (res.error) { console.error("Error checking whether user has sm token for platform " +
        socialMediaPlatform + ": " + res.error); }

          return res.exists;
      });
  }

  async getSocialMediaOptionsForUser(socialMediaPlatform: string) {
    const userSocialMediaGetOptsUrl = 'http://localhost:3000/social/trello/boards';
    let opts = undefined;
    return this.http.get(userSocialMediaGetOptsUrl).toPromise().then((res: any) => {
      // List of trello boards and ids
      if (res.error) { console.error("Error attempting to retrieve trello boards: ", res.error); }

      else {
        return res.boards;
      }
    });

    //return opts;
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
