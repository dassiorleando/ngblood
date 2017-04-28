import { SocketIoService } from './socket.service';
import { EsriMapService } from './esri-map.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';

// also import the "angular2-esri-loader" to be able to load JSAPI modules
import { EsriLoaderService } from 'angular2-esri-loader';
import {MdDialog, MdDialogConfig, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-esri-map-donor',
  templateUrl: './esri-map-donor.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapDonorComponent implements OnInit {

  // for JSAPI 4.x you can use the "any for TS types
  public mapView: __esri.MapView;
  // The map object
  public popup: __esri.Popup;

  points: any = []; // List of all points
  positionToShare = {}; // Position to share as a donor

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewDonorNode') private mapViewEl: ElementRef;

  constructor(
    private esriLoader: EsriLoaderService,
    private esriMapService: EsriMapService,
    private dialog: MdDialog,
    private router: Router
  ) { }

  registerModal(config) {
    // We open the modal and close it after successfully save the donor
    var dialogRef = this.dialog.open(DonorRegisterDialog, config);
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result != null){
        dialogRef = null;
        this.popup.close();
        this.router.navigate(['/']);
      }
    });
  }

  public ngOnInit() {
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriLoader.load({
      // use a specific version of the JSAPI
      url: 'https://js.arcgis.com/4.3/'
    }).then(() => {
      // load the needed Map and MapView modules from the JSAPI
      this.esriLoader.loadModules([
        'esri/Map',
        'esri/views/MapView'
      ]).then(([Map, MapView]) => {
        
        var self = this;
        // We create the map
        var map = new Map({
          basemap: "dark-gray"
        });

        // The mapview associated to the map object
        this.mapView = new MapView({
          center: [-80, 35],
          container: this.mapViewEl.nativeElement,
          map: map,
          zoom: 3
        });

        self.popup = self.mapView.popup;

        // Event on mapview
        // Set up a click event handler and retrieve the screen x, y coordinates 
        self.mapView.on("click", function(evt) {
          // Get the coordinates of the click on the view
          var lat = Math.round(evt.mapPoint.latitude * 1000) / 1000;
          var lon = Math.round(evt.mapPoint.longitude * 1000) / 1000;

          // The current position to share
          self.positionToShare = {latitude: lat, longitude: lon};
          
          self.popup.open({
            // Set the popup's title to the coordinates of the location 
            title: "Position: [Longitude: " + lon + " & Latitude: " + lat + "]",
            location: evt.mapPoint // Set the location of the popup to the clicked location
          });
        });

        // Create a custom action
        const moreDetailsAction = {
          // This text is displayed as a tool tip
          title: 'Donate Blood',
          id: 'donate-blood',
          className: 'esri-icon-locked'
        };

        // Adds the action to the view's default popup.
        self.popup.actions.push(moreDetailsAction);

        // Trige custom event on the current map point
        // event handler that fires each time an action is clicked
        self.popup.on('trigger-action', (event) => {
          /* If the zoom-out action is clicked, the following code executes  */
          if (event.action.id === 'donate-blood') {
            let config = new MdDialogConfig(); // Data to send to modal: map point
            config.data = self.positionToShare;

            // We open the modal to record a donor
            self.registerModal(config);
          }
        });
      });

    });
  }
}


// Component for the register modal
@Component({
  selector: 'donor-register-dialog',
  templateUrl: './esri-map-donor-register.component.html',
})
export class DonorRegisterDialog {
    // All available blood type
    blood_types = [
      'A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'
    ];
    constructor(
      public dialogRef: MdDialogRef<DonorRegisterDialog>,
      @Inject(MD_DIALOG_DATA) public data: any,
      private esriMapService: EsriMapService,
      private socketIoService: SocketIoService) {
        data.contact = {};
    }

     // Action record a blood donor
     shareBlood(){
       this.esriMapService.postPoint(this.data).subscribe(savedPoint => {
        console.log(savedPoint);
        // We close the modal once the data is saved
        if(savedPoint){
          this.socketIoService.emitEventOnBloodSaved(savedPoint); // Emit event
          this.dialogRef.close('closed');
        }else{
          // On error, tell the user to try gain
          alert('Try your request again');
        }
      });
     }

}