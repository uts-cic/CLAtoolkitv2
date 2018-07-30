import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private unitSetupService: UnitSetupService, private router: Router) { }

  ngOnInit() {
  }

  submitUnitForm() {
    console.log(this.unitFormModelStep1);
  	// this.validateUnitForm(); TODO: Later if need be (getting MVP working)

  	this.unitSetupService.addUnitDetails(this.unitFormModelStep1);
  	this.router.navigate(['new/social-setup']);
  }

}
