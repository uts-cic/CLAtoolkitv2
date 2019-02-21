import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http'; 

import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
	jwt = new JwtHelperService();

  user = undefined;

  constructor(private http: HttpClient, private router: Router) { }

  storeToken(jwtToken) {
    const decoded = this.jwt.decodeToken(jwtToken);
    this.user = decoded;
    localStorage.setItem('clatk-token', jwtToken);
    this.router.navigate(['/home']);
  }

  registerUser(formData, nextRoute, done) {
  	const registerUrl = environment.backend_api + 'auth/register/';

  	delete formData.passwordConf;

  	this.http.post(registerUrl, { form: formData }).subscribe((res: any) => {
  		if (res.status == 401) { done(res); }

  		if (res.token) {
  			const decoded = this.jwt.decodeToken(res.token);
  			this.user = decoded;
  			localStorage.setItem('clatk-token', res.token);
        nextRoute = nextRoute || '/home';
  			this.router.navigate([nextRoute]);
  			// done(undefined);
  		}
  	})
  }

  loginUser(formData, nextRoute, done) {
  	const loginUrl = environment.backend_api + 'auth/login/';

  	delete formData.passwordConf;

  	this.http.post(loginUrl, { form: formData }).subscribe((res: any) => {
  		if (res.status == 401) { done(res); }

  		if (res.token) {
  			const decoded = this.jwt.decodeToken(res.token);
  			this.user = decoded;
  			localStorage.setItem('clatk-token', res.token);
        nextRoute = nextRoute || '/home';
  			this.router.navigate([nextRoute]);
  			// done(undefined);
  		}
  	});
  }

  logout() {
    localStorage.removeItem('clatk-token');
    location.reload();
  }


  // TODO: Refactor social media stuff to seperate service
  userHasSocialMediaTokenFor(socialMediaPlatform: string) {
    const userSocialMediaTokenUrl = environment.backend_api + 'auth/tokenCheck/';
    return this.http.post(userSocialMediaTokenUrl, { platform: socialMediaPlatform });
  }

  async asyncUserHasSocialMediaTokenFor(socialMediaPlatform: string) {
    const userSocialMediaTokenUrl = environment.backend_api + 'auth/tokenCheck/';
    return this.http.post(userSocialMediaTokenUrl, { platform: socialMediaPlatform }).toPromise()
      .then((res: any) => {
        if (res.error) { console.error("Error checking whether user has sm token for platform " +
        socialMediaPlatform + ": " + res.error); }

          return res.exists;
      });
  }

  async getSocialMediaOptionsForUser(socialMediaPlatform: string) {
    const userSocialMediaGetOptsUrl = environment.backend_api + 'social/' + socialMediaPlatform + '/opts';
    let opts = undefined;
    return this.http.get(userSocialMediaGetOptsUrl).toPromise().then((res: any) => {
      // List of trello boards and ids
      if (res.error) { console.error("Error attempting to retrieve trello boards: ", res.error); }

      else {
        return res.opts;
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
