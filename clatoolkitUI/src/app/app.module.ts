import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Modules
import { Router } from './routes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { UnitSetupComponent } from './unit-setup/unit-setup/unit-setup.component';
import { UnitSocialmediaSetupComponent } from './unit-setup/unit-socialmedia-setup/unit-socialmedia-setup.component';
import { UnitLrsSetupComponent } from './unit-setup/unit-lrs-setup/unit-lrs-setup.component';
import { UnitSignupComponent } from './unit-signup/unit-signup.component';
import { DynamicSignupFormComponent } from './unit-signup/dynamic-signup-form/dynamic-signup-form.component';
import { DynamicFormInputComponent } from './unit-signup/dynamic-signup-form/dynamic-form-input/dynamic-form-input.component';
import { UnitsListComponent } from './home/units-list/units-list.component';
import { CustomLrsFormComponent } from './unit-setup/unit-lrs-setup/custom-lrs-form/custom-lrs-form.component';

// Services
import { AuthService } from './services/auth.service';
import { UnitService } from './services/unit.service';
import { UnitSetupService } from './services/unit-setup.service';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { DynamicFormService } from './unit-signup/dynamic-signup-form/dynamic-form.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { UnitSetupStep2Guard } from './guards/unit-setup-step2.guard';
import { UnitSetupStep3Guard } from './guards/unit-setup-step3.guard';
import { IsUnitOwnerGuard } from './guards/isunitowner.guard';




@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    UnitSetupComponent,
    UnitSocialmediaSetupComponent,
    UnitLrsSetupComponent,
    UnitSignupComponent,
    DynamicSignupFormComponent,
    DynamicFormInputComponent,
    UnitsListComponent,
    CustomLrsFormComponent,
  ],
  imports: [
    NgbModule.forRoot(),
  	Router,
  	HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
  	AuthService,
  	UnitService,
  	AuthGuard,
    UnitSetupStep2Guard,
    UnitSetupStep3Guard,
    IsUnitOwnerGuard,
    UnitSetupService,
    DynamicFormService,
    // Interceptor Provider dec
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
