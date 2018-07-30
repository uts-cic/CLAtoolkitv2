import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { UnitSetupService } from '../services/unit-setup.service';

@Injectable()
export class UnitSetupStep2Guard implements CanActivate {

	constructor(private unitSetupService: UnitSetupService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
  	if (this.unitSetupService.unitData.unit != undefined) {
  		return true;
  	} else {
  		this.router.navigate(['new/unit-setup']);
  		return false;
  	}

  }
}
