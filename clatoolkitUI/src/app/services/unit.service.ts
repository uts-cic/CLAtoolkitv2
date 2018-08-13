import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { UnitSetupService } from './unit-setup.service';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class UnitService {

	selectedUnitId: string;
  units: any[] = [];

  constructor(private http: HttpClient, private router: Router, 
    private authService: AuthService, private unitSetupService: UnitSetupService) { }

  // Get Units for user from backend
  // Store units in service and return to frontend
  getUnitsForUser(): Observable<any> {
  	const getUnitsUrl = 'http://localhost:3000/account/units'

  	return this.http.get(getUnitsUrl).map((res: any) => {
      // res = res;

      this.units = res.units;

      return this.units;
    });
  }

  getUnitById(id: string) {
    const getUnitByIdUrl = 'http://localhost:3000/units/' + id;
    return this.http.get(getUnitByIdUrl);
  }

  isOwner(unitId: string) {
    // Finds unit by id
    const unit = this.units.find(unit => unit._id == unitId);

    if (!unit) {
      return false;
    }

    // Checks if unit belongs to user
    if (unit.created_by == this.authService.getUser().id) {
      // Build edit form data
      this.unitSetupService.buildDataFromUnit(unit);
      return true;
    } else {
      return false;
    }

    // return (this.units.find(unit => unit._id == unitId).belongsTo == this.authService.getUser().id);
  }

  setSelectedUnit(id: string) {
  	this.selectedUnitId = id;
  }

  registerUser(registerForm: {}) {
  	const postRegisterUserToUnitUrl = 'http://localhost:3000/units/' + this.selectedUnitId + '/register/'
  	// Check result here since we're gonna redirect
  	this.http.post(postRegisterUserToUnitUrl, registerForm).subscribe((res: any) => {
  		if (res.error) { console.error("Error occurred attempting to add user to unit: ", res.error); }

  		if (res.success == true) {
  			this.router.navigate(['/home']);
  		}
  	});
  }

}
