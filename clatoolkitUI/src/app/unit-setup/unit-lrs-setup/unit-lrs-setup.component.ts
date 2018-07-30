import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UnitSetupService } from '../../services/unit-setup.service';

@Component({
  selector: 'app-unit-lrs-setup',
  templateUrl: './unit-lrs-setup.component.html',
  styleUrls: ['./unit-lrs-setup.component.css']
})
export class UnitLrsSetupComponent implements OnInit {

	defaultLRS: boolean = true;
	customLRS: boolean = false;

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

	/*
	customLRSFormModel = {
		endpoint: undefined,
		auth: {
			authType: undefined
			// Add auth here
		}
	}
	*/

	/*
	customLRSBasicAuth {
		username: undefined,
		password: undefined
	}
	*/

  constructor(private unitSetupService: UnitSetupService, private router: Router) { }

  ngOnInit() {
  }

  submitUnitForm() {
  	(this.defaultLRS == true) ? this.unitSetupService.addUnitLRS({default: true}) : false; // TODO: add custom lrs model once this functionality is added.
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
