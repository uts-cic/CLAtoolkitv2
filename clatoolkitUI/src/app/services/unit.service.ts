import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class UnitService {

	selectedUnitId: string;

  constructor(private http: HttpClient, private router: Router) { }

  getUnitsForUser() {
  	const getUnitsUrl = 'http://localhost:3000/account/units'
  	return this.http.get(getUnitsUrl);
  }

  getUnitById(id: string) {
    const getUnitByIdUrl = 'http://localhost:3000/units/' + id;
    return this.http.get(getUnitByIdUrl);
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
