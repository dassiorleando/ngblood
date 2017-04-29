import { Toast, ToasterService } from 'angular2-toaster';
import { CustomPoint } from './esri-map-point.component';
import { SocketIoService } from './socket.service';
import { EsriMapService } from './esri-map.service';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';

// also import the "angular2-esri-loader" to be able to load JSAPI modules
import { EsriLoaderService } from 'angular2-esri-loader';

import {MdDialog, MdDialogConfig, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  // for JSAPI 4.x you can use the "any for TS types
  public mapView: __esri.MapView;
  public map: __esri.Map;
  public lyr:__esri.FeatureLayer;
  private selectedGraphic:any = null;
  points: any = []; // List of all points
  
  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private esriLoader: EsriLoaderService,
    private esriMapService: EsriMapService,
    private socketIoService: SocketIoService,
    private dialog: MdDialog,
      private toasterService: ToasterService
  ) { 
    
    this.socketIoService.consumeEvenOnBloodSaved(); // consume it
    this.socketIoService.pointShared$.subscribe(point => this.onPointShared(point));
  }x

  onPointShared(newPoint: CustomPoint){
    var self = this;
    console.log('We add this point to the map now');
    console.log(newPoint); // We add this point to the map now

    const pointProperties:__esri.PointProperties = {
      longitude: newPoint.longitude,
      latitude: newPoint.latitude
    }

    // only load the ArcGIS API for JavaScript when this component is loaded
    return self.esriLoader.load({
      // use a specific version of the JSAPI
      url: 'https://js.arcgis.com/4.3/'
    }).then(() => {
      // load the needed Map and MapView modules from the JSAPI
      self.esriLoader.loadModules([
        'esri/Graphic',
        'esri/geometry/Point'
        ]).then(([Graphic, Point]) => {

        let g = {
          geometry: new Point({
            longitude: newPoint.longitude,
            latitude: newPoint.latitude

          }),
          attributes: {
            blood: newPoint.blood_type,
            firstName: newPoint.firstName,
            lastName: newPoint.lastName,
            phoneNumber: newPoint.phoneNumber,
            email: newPoint.email
          }
        }

        var edits = {
          addFeatures: [new Graphic(g)]
        };
        self.lyr.applyEdits(edits);
        // self.map.add(self.lyr);
      })});
  }

  public ngOnInit() {
    var self = this;
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriLoader.load({
      // use a specific version of the JSAPI
      url: 'https://js.arcgis.com/4.3/'
    }).then(() => {
      // load the needed Map and MapView modules from the JSAPI
      this.esriLoader.loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/layers/FeatureLayer',
        'esri/renderers/SimpleRenderer'
      ]).then(([Map, MapView, Point,
                SimpleMarkerSymbol, FeatureLayer, SimpleRenderer]) => {
        
        

        self.map = new Map({
          basemap: "dark-gray"
        });

       self.mapView = new MapView({
        center: [-80, 35],
        container: self.mapViewEl.nativeElement,
        map: self.map,
        zoom: 3
      });

      // Setup event on the Graphic to display phone number and email: Start
      // Custom actions to show email and phone number
      var displayEmailAction = {
          // This text is displayed as a tool tip
          title: 'Show Email',
          id: 'show-email',
          className: 'fa fa-envelope'
      };
      var displayPhoneNumberAction = {
          // This text is displayed as a tool tip
          title: 'Show Phone',
          id: 'show-phone',
          className: 'fa fa-phone'
      };

      // self.mapView.popup.actions.push(displayEmailAction);
      // self.mapView.popup.actions.push(displayPhoneNumberAction);

      // Event handler that fires each time an action is clicked
      self.mapView.popup.on('trigger-action', (event) => {
        /* If the zoom-out action is clicked, the following code executes  */
        if (event.action.id === 'show-email') {
          if(self.selectedGraphic){
            let config = new MdDialogConfig(); // Data to send to modal: map point
            config.data = this.selectedGraphic.attributes.email;

            // We toast the info of the record a donor
            var toast :Toast = {
                type: 'info',
                title: 'Donor Email',
                body: self.selectedGraphic.attributes.email,
                showCloseButton: true
                // closeHtml: '<button>Close</button>'
            };
            this.toasterService.pop(toast);
          }
        }

        if (event.action.id === 'show-phone') {
          if(self.selectedGraphic){
            let config = new MdDialogConfig(); // Data to send to modal: map point
            config.data = self.selectedGraphic.attributes.phoneNumber;

            // We toast the phone of donor
            var toast :Toast = {
                type: 'info',
                title: 'Donor Phone',
                body: self.selectedGraphic.attributes.phoneNumber,
                showCloseButton: true
            };
            this.toasterService.pop(toast);
          }
        }
      });
      // Setup event on the Graphic to display phone number and email: End

      // Get all points
      self.esriMapService.getAllPoints().subscribe(points => {
        self.points = points;
      });

      /**************************************************
       * Define the specification for each field to create
       * in the layer
       **************************************************/

      var fields = [
      {
        name: "ObjectID",
        alias: "ObjectID",
        type: "oid"
      }, {
        name: "blood",
        alias: "blood",
        type: "string"
      }, {
        name: "firstName",
        alias: "First Name",
        type: "string"
      }, {
        name: "lastName",
        alias: "Last Name",
        type: "string"
      }];

      // Set up popup template for the layer
      var pTemplate = {
        title: "{title}",
        content: [{
          type: "fields",
          fieldInfos: [{
            fieldName: "blood",
            label: "Blood",
            visible: true
          }, {
            fieldName: "firstName",
            label: "First Name",
            visible: true
          }, {
            fieldName: "lastName",
            label: "Last Name",
            visible: true
          }]
        }],
        actions: [displayEmailAction, displayPhoneNumberAction],
        overwriteActions: true,
        fieldInfos: [{
          fieldName: "time",
          format: {
            dateFormat: "short-date-short-time"
          }
        }]
      };

      self.mapView.then(function() {
        var quakesRenderer = new SimpleRenderer({
        symbol: new SimpleMarkerSymbol({
          style: "circle",
          size: 20,
          color: [211, 255, 0, 0],
          outline: {
            width: 1,
            color: "#FF0055",
            style: "solid"
          }
        })
      });

      self.mapView.on("click", function(evt) {
        var screenPoint = {
          x: evt.x,
          y: evt.y
        };

        self.mapView.hitTest(screenPoint)
          .then(function(response){
            console.log(response);
            // do something with the result graphic
            var graphic = response.results[0].graphic;
            console.log(graphic);
            self.selectedGraphic = graphic;
          });
        });

        // Request the earthquake data from USGS when the view resolves
        self.esriMapService.getAllPoints()
          .subscribe(points => {
          // Computed geo points
          var geos = points.map(function(point) { 
            var geo = {
              geometry: new Point({
                x: point.longitude,
                y: point.latitude
              }),
              // select only the attributes you care about
              attributes: {
                // ObjectID: i,
                blood: point.blood_type,
                firstName: point.contact.firstName,
                lastName: point.contact.lastName,
                phoneNumber: point.contact.phoneNumber,
                email: point.contact.email
              }
            }

            return geo;
          });

          self.lyr = new FeatureLayer({
            source: geos, // autocast as an array of esri/Graphic
            // create an instance of esri/layers/support/Field for each field object
            fields: fields, // This is required when creating a layer from Graphics
            objectIdField: "ObjectID", // This must be defined when creating a layer from Graphics
            renderer: quakesRenderer, // set the visualization on the layer
            spatialReference: {
              wkid: 4326
            },
            geometryType: "point", // Must be set when creating a layer from Graphics
            popupTemplate: pTemplate
          });

          self.map.add(self.lyr);
        });
      });

    });
  });
}

}