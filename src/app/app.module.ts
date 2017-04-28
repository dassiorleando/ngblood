import { SocketIoService } from './esri-map/socket.service';
import { EsriMapService } from './esri-map/esri-map.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { DonorRegisterDialog, EsriMapDonorComponent } from './esri-map/esri-map-donor.component';
import { EsriLoaderService } from 'angular2-esri-loader';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    EsriMapDonorComponent,
    DonorRegisterDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: '', // Patient state
        component: EsriMapComponent
      },
      {
        path: 'donor',  // Donor state
        component: EsriMapDonorComponent
      }
    ])
  ],
  providers: [EsriLoaderService, EsriMapService, SocketIoService],
  bootstrap: [AppComponent],
  entryComponents: [DonorRegisterDialog]
})
export class AppModule { }
