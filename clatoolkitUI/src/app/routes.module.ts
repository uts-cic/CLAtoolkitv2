import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { UnitSetupStep2Guard } from './guards/unit-setup-step2.guard';
import { UnitSetupStep3Guard } from './guards/unit-setup-step3.guard';

// Component Imports
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { UnitSetupComponent } from './unit-setup/unit-setup/unit-setup.component';
import { UnitSocialmediaSetupComponent } from './unit-setup/unit-socialmedia-setup/unit-socialmedia-setup.component';
import { UnitLrsSetupComponent } from './unit-setup/unit-lrs-setup/unit-lrs-setup.component';


const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'login', component: AuthComponent },
	{ path: 'home', 
	  component: HomeComponent,
	  canActivate: [AuthGuard] 
	},
	// TODO: WIll probably require canActivate Guards for each stepped part of the form drawing from UnitSetupService
	{
		path: 'new/unit-setup',
		component: UnitSetupComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'new/social-setup',
		component: UnitSocialmediaSetupComponent,
		canActivate: [AuthGuard, UnitSetupStep2Guard]
	},
	{
		path: 'new/data-setup',
		component: UnitLrsSetupComponent,
		canActivate: [AuthGuard, UnitSetupStep3Guard]
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [
		RouterModule
	]
})
export class Router {};