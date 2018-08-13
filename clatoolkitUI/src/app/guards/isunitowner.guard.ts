import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UnitService } from '../services/unit.service';

@Injectable()
export class IsUnitOwnerGuard implements CanActivate {
	constructor(private unitService: UnitService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
  	return this.unitService.isOwner(next.params.id);

  }
}
