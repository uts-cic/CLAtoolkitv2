import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http'; 

@Injectable()
export class UnitService {

  constructor(private http: HttpClient) { }

  getUnitsForUser() {
  	const getUnitsUrl = 'http://localhost:3000/account/units'
  	return this.http.get(getUnitsUrl);
  }

  getUnitById(id: string) {
    const getUnitByIdUrl = 'http://localhost:3000/units/' + id;
    return this.http.get(getUnitByIdUrl);
  }

}
