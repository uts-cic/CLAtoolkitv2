import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UnitSetupService } from '../../services/unit-setup.service';
import { LrsModel } from '../../models/LrsModel';

@Component({
  selector: 'app-unit-lrs-setup',
  templateUrl: './unit-lrs-setup.component.html',
  styleUrls: ['./unit-lrs-setup.component.css']
})
export class UnitLrsSetupComponent implements OnInit {

	defaultLRS: boolean = true;
	// customLRS: boolean = false;
	defaultLRSDetails: object;
	customLRSDetails: Array<object> = [];

	useCustomLRS: boolean = false;
	showNewCustomLRSForm: boolean = false;

	/*
		 Biggest issue here is that the way LRS's handle authentication differs
		 DESPITE complying with the xAPI LRS specification
		 Some ways that LRS's can handle Auth is:
		  - Basic Auth -> username:password (has to be base64 encoded before being used)
		  - Basic Auth Token -> As above but already b64 encoded, provided by LRS
		  - oAuth Token
		  - Other LRS provided Token
		 We will need to handle this for every custom LRS being used. WILL BE A PAIN
		 
		 For now, for the MVP, we will use the Default CLToolkit LRS.
	*/

	lrsModel: LrsModel;

	customLRSChoice: string;

  constructor(private unitSetupService: UnitSetupService, private router: Router) { }

  ngOnInit() {
	  this.unitSetupService.getLearningRecordStores().subscribe((res: any) => {
  		if (res.error) { console.error("Error grabbing LRS's from backend: ", res.error); }

  		this.customLRSDetails = res.customLRS;
  		this.defaultLRSDetails = res.defaultLRS;
  	});
  }

  setProperty(checked: boolean) {
  	this.defaultLRS = checked;
  }

  submitUnitForm() {
  	//(this.defaultLRS == true) ? this.unitSetupService.addUnitLRS({default: true}) : false; // TODO: add custom lrs model once this functionality is added.
  	console.log("defaultLRS: ", this.defaultLRS);
  	if (this.defaultLRS) {
  		console.log("using default lrs");
 		this.unitSetupService.addUnitLRS({default: true});
  	} else if (!this.defaultLRS) {
  		console.log("using custom lrs:");
  		const lrs = this.customLRSDetails.find((lrs: any) => lrs.name == this.customLRSChoice);
  		console.log(lrs);
  		this.unitSetupService.addUnitLRS({ default: false, lrs: lrs});
  	}

  }

  toggleCustomLrsPane() {
  	this.useCustomLRS = !this.useCustomLRS;
  }

  newCustomLrs() {
  	this.showNewCustomLRSForm = !this.showNewCustomLRSForm;
  	console.log("Custom lrs toggle: ", this.showNewCustomLRSForm);
  }

  handleNewLRS(newLRS: LrsModel) {
  	this.customLRSDetails.unshift(newLRS);
  	this.showNewCustomLRSForm = !this.showNewCustomLRSForm;
  }

  submitAndCompleteUnitForm() {
  	this.submitUnitForm();

  	this.unitSetupService.sendUnitFormToBackend().subscribe((res: any) => {
  		if (res.success) {
  			this.router.navigate(['home']);
  		} // else errors.. do stuff with them.
  	});
  }

}
