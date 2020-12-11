import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterDeviceComponent } from './register-device/register-device.component';
import { AddNewCheckComponent } from './add-new-check/add-new-check.component';
import { CheckListsComponent } from './check-lists/check-lists.component';
import { ScanDeviceComponent } from './scan-device/scan-device.component';
import { LoginComponent } from './login/login.component';
import { Route, RouterModule } from '@angular/router';
import { TableComponent } from './table/table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule,MatDialogModule, MatExpansionModule, MatSnackBarModule } from  '@angular/material';
import { RegisterNewDeviceComponent } from './register-new-device/register-new-device.component'
import { HttpClientModule } from '@angular/common/http';
import { AlertNotificationComponent } from './alert-notification/alert-notification.component';
import { CommonService } from './shared/common.service';
import { SharedModule } from './shared/shared.module';

let routes:Route[]=[
  {
    path:'home',
    component:ScanDeviceComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'register-device',
    component:RegisterDeviceComponent
  },
  {
    path:'checks-lists',
    component:CheckListsComponent
  },
 
  { path: "", redirectTo: "/login", pathMatch: "full" },

]
@NgModule({
  declarations: [
    AppComponent,
    RegisterDeviceComponent,
    AddNewCheckComponent,
    CheckListsComponent,
    ScanDeviceComponent,
    LoginComponent,
    TableComponent,
    RegisterNewDeviceComponent,
    AlertNotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    FontAwesomeModule ,
    NgbModule,
    MatDialogModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatSnackBarModule,
    SharedModule,
    [RouterModule.forRoot(routes) ]
  ],
  entryComponents:[RegisterNewDeviceComponent,AddNewCheckComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
