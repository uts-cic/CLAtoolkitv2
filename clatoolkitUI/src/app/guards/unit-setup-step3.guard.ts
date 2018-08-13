import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { UnitSetupService } from '../services/unit-setup.service';

@Injectable()
export class UnitSetupStep3Guard implements CanActivate {

	constructor(private unitSetupService: UnitSetupService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  	if (this.unitSetupService.unitData.social_media != undefined) {
  		return true;
  	} else {
  		this.router.navigate(["unit/unit-setup"]);
  		return false;
  	}

  }
}
