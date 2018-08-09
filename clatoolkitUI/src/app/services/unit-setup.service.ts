import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http'; 

@Injectable()
export class UnitSetupService {

	unitData = {
		unit: undefined,
		lrs: undefined,
		social_media: undefined
	};

  constructor(private http: HttpClient) { }

  addUnitDetails(unitSetupForm) {
  	this.unitData.unit = unitSetupForm;
  }

  getLearningRecordStores() {
    const getLRSDetailsEndpoint: string = 'http://localhost:3000/lrs/';
    return this.http.get(getLRSDetailsEndpoint)
  }

  addSocialMediaDetails(unitSocialMediaForm) {
  	this.unitData.social_media = unitSocialMediaForm;
  }

  addUnitLRS(unitLRSForm) {
    this.unitData.lrs = unitLRSForm;
  }

  sendUnitFormToBackend() {
    const createUnitEndpoint: string = 'http://localhost:3000/units/';
    return this.http.post(createUnitEndpoint, this.unitData);
  }

}
