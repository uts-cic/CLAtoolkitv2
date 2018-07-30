import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UnitSetupService } from '../../services/unit-setup.service';


@Component({
  selector: 'app-unit-socialmedia-setup',
  templateUrl: './unit-socialmedia-setup.component.html',
  styleUrls: ['./unit-socialmedia-setup.component.css']
})
export class UnitSocialmediaSetupComponent implements OnInit {

	twitterEnabled: boolean;

	unitFormModelStep2 = {
		twitter: undefined, // string: hashtag
		trello: undefined, // Boolean
		github: undefined, // Boolean
		slack: undefined // Boolean
	}

  constructor(private unitSetupService: UnitSetupService, private router: Router) { }

  ngOnInit() {
  }

  submitUnitForm() {
  	// this.validateSocialMediaInput() // Todo: later if required

  	this.unitSetupService.addSocialMediaDetails(this.unitFormModelStep2);
  	this.router.navigate(['new/']);
  }

}
