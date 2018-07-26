import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Component Imports
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'login', component: AuthComponent },
	{ path: 'home', 
	  component: HomeComponent,
	  canActivate: [AuthGuard] 
	},
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [
		RouterModule
	]
})
export class Router {};