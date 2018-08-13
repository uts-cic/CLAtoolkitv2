import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UnitSetupService } from '../../services/unit-setup.service';

@Component({
  selector: 'app-unit-setup',
  templateUrl: './unit-setup.component.html',
  styleUrls: ['./unit-setup.component.css']
})
export class UnitSetupComponent implements OnInit {

	public unitFormModelStep1 = {
		name: '',
		code: '',
		semester: '',
		description: '',

		startDate: '',
		endDate: '',

		ethicsStatement: ''
	};

  headerText: string;

  constructor(private unitSetupService: UnitSetupService, private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.headerText = "Create New Unit";
    const previouslySavedDetails = this.unitSetupService.getStepDetails().unit;
    if (previouslySavedDetails != undefined) {
      this.unitFormModelStep1 = previouslySavedDetails;
      this.headerText = "Edit " + this.unitFormModelStep1.name;
    }
  }

  submitUnitForm() {
    console.log(this.unitFormModelStep1);
  	// this.validateUnitForm(); TODO: Later if need be (getting MVP working)

  	this.unitSetupService.addUnitDetails(this.unitFormModelStep1);
  	
    this.router.navigate(['unit/social-setup']);
  }

}
