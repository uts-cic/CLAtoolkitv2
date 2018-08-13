import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
	email: string;

	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit() {
		if (!this.authService.isLoggedIn()) {
			this.router.navigate(['/login']);
		} else {
			this.email = this.authService.getUser().email;
		}
	}

	logout() {
		this.authService.logout();
	}

	isLoggedIn() {
		return this.authService.isLoggedIn();
	}

}
