import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http'; 

import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class UnitSetupService {

  // For building edit data
  // If a new platform is added to toolkit
  // Add it's identifier here to build edit 
  // form properly
  PLATFORM_CONFIG = [
    "twitter",
    "trello",
    "github",
    "slack"
  ];

  editId: string = '';

	unitData = {
		unit: undefined,
		lrs: undefined,
		social_media: undefined,
    id: undefined
	};

  constructor(private http: HttpClient) { }

  addUnitDetails(unitSetupForm) {
  	this.unitData.unit = unitSetupForm;
  }

  getLearningRecordStores() {
    const getLRSDetailsEndpoint: string = environment.backend_api + 'lrs/';
    return this.http.get(getLRSDetailsEndpoint)
  }

  addSocialMediaDetails(unitSocialMediaForm) {
  	this.unitData.social_media = unitSocialMediaForm;
  }

  addUnitLRS(unitLRSForm) {
    this.unitData.lrs = unitLRSForm;
  }

  sendUnitFormToBackend() {
    const createUnitEndpoint: string = environment.backend_api + 'units/';
    // console.log(this.unitData);
    if (this.editId != '') {
      this.unitData.id = this.editId.slice(0, -1);
    }
    return this.http.post(createUnitEndpoint + this.editId, this.unitData);
  }

  async buildDataFromUnit(unit): Promise<void> {
    const unitDetails: any = {};
    unitDetails.name = unit.name;
    unitDetails.code = unit.code;
    unitDetails.semester = unit.semester;
    unitDetails.description = unit.description;
    unitDetails.startDate = unit.start_date;
    unitDetails.endDate = unit.end_date;
    unitDetails.ethicsStatement = unit.ethics_statement;

    this.unitData.unit = unitDetails;

    const unitSocialMedia: any = {};
    
    for (const platform of this.PLATFORM_CONFIG) {
      const unitPlat = unit.platforms.find(socialInUnit => socialInUnit.platform == platform);
      if (!unitPlat) {
        (platform == "twitter") ? unitSocialMedia[platform] = '' : unitSocialMedia[platform] = { selected: false, required: false };
      } else {
        (platform == "twitter") ? 
          unitSocialMedia[platform] = unitPlat.retrieval_param : 
          unitSocialMedia[platform] = { selected: true, required: unitPlat.required };
      }
    }

    this.unitData.social_media = unitSocialMedia;

    this.unitData.lrs = unit.lrs;

    this.editId = unit._id + '/';
  }

  getStepDetails() {
    return this.unitData;
  }

  newUnit() {
    this.unitData = {
      unit: undefined,
      lrs: undefined,
      social_media: undefined,
      id: undefined
    };
  }

}
