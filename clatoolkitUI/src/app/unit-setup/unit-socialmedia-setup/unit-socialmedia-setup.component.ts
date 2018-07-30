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
		trello: false, // Boolean
		github: false, // Boolean
		slack: false // Boolean
	}

  constructor(private unitSetupService: UnitSetupService, private router: Router) { }

  ngOnInit() {
  }

  submitUnitForm() {
    console.log(this.unitFormModelStep2);
  	// this.validateSocialMediaInput() // Todo: later if required

  	this.unitSetupService.addSocialMediaDetails(this.unitFormModelStep2);
  	this.router.navigate(['new/data-setup']);
  }

  toggleHashtagField() {
    this.twitterEnabled = !this.twitterEnabled;
  }

}
