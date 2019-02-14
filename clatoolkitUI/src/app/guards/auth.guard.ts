import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    // console.log("next: ", next);
    if (!this.authService.isLoggedIn()) {
      // Slight behaviour change - return user to page they were trying to 
      // access previously after login/signup, to do this, we're adding
      // url query param "next", which will determine where login controller
      // redirects after login/signup

    	this.router.navigate(['login'], { queryParams: { next: next.routeConfig.path }});
    	return false;
    }

    return true;
  }
}
