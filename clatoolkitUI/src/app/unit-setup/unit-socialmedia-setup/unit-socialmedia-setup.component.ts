import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UnitSetupService } from '../../services/unit-setup.service';


@Component({
  selector: 'app-unit-socialmedia-setup',
  templateUrl: './unit-socialmedia-setup.component.html',
  styleUrls: ['./unit-socialmedia-setup.component.css']
})
export class UnitSocialmediaSetupComponent implements OnInit {

	twitterEnabled: boolean = false;

	unitFormModelStep2 = {
		twitter: '', // string: hashtag
		trello: {
      selected: false,
      required: false
    },
		github: {
      selected: false,
      required: false
    },
		slack: {
      selected: false,
      required: false
    }
	}

  headerText: string;

  constructor(private unitSetupService: UnitSetupService, private router: Router) { }

  ngOnInit() {
    this.headerText = "Create New Unit";
    const previouslySavedDetails = this.unitSetupService.getStepDetails().social_media;
    if (previouslySavedDetails != undefined) {

      this.unitFormModelStep2 = previouslySavedDetails;
      if (this.unitFormModelStep2.twitter != '') {
        this.twitterEnabled = true;
      }
      this.headerText = "Edit " + this.unitSetupService.getStepDetails().unit.name;
    }
  }

  submitUnitForm() {
    console.log(this.unitFormModelStep2);
  	// this.validateSocialMediaInput() // Todo: later if required

  	this.unitSetupService.addSocialMediaDetails(this.unitFormModelStep2);
  	this.router.navigate(['unit/data-setup']);
  }

  toggleHashtagField() {
    this.twitterEnabled = !this.twitterEnabled;
  }

}
