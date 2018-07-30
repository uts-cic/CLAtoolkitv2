import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http'; 

@Injectable()
export class UnitService {

  constructor(private http: HttpClient) { }

  getUnitsForUser() {
  	const getUnitsUrl = 'http://localhost:3000/account/units'
  	return this.http.get(getUnitsUrl);
  }

  private createHeaderWithAuth(): HttpHeaders {
  	let headers = new HttpHeaders();
  	headers.set('Authorization', 'Bearer ' + localStorage.getItem('clatk-token'));
  	return headers;
  }

}
