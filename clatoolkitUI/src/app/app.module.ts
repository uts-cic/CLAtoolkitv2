import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

// Modules
import { Router } from './routes.module';

// Components
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { UnitSetupComponent } from './unit-setup/unit-setup/unit-setup.component';
import { UnitSocialmediaSetupComponent } from './unit-setup/unit-socialmedia-setup/unit-socialmedia-setup.component';
import { UnitLrsSetupComponent } from './unit-setup/unit-lrs-setup/unit-lrs-setup.component';

// Services
import { AuthService } from './services/auth.service';
import { UnitService } from './services/unit.service';
import { UnitSetupServiceService } from './services/unit-setup-service.service';

// Guards
import { AuthGuard } from './guards/auth.guard';




@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    UnitSetupComponent,
    UnitSocialmediaSetupComponent,
    UnitLrsSetupComponent,
  ],
  imports: [
  	Router,
  	HttpClientModule,
    BrowserModule,
    FormsModule
  ],
  providers: [
  	AuthService,
  	UnitService,
  	AuthGuard,
  	UnitSetupServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
