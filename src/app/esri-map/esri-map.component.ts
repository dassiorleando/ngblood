import { SocketIoService } from './socket.service';
import { EsriMapService } from './esri-map.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// also import the "angular2-esri-loader" to be able to load JSAPI modules
import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  // for JSAPI 4.x you can use the "any for TS types
  public mapView: __esri.MapView;
  points: any = []; // List of all points
  
  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private esriLoader: EsriLoaderService,
    private esriMapService: EsriMapService,
    private socketIoService: SocketIoService
  ) { 
    this.socketIoService.emitEventOnBloodSaved({name: 'Dassi', age: 23}); // Emit event
    this.socketIoService.consumeEvenOnBloodSaved(); // consume it
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
        'esri/views/MapView',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/layers/FeatureLayer',
        'esri/renderers/SimpleRenderer'
      ]).then(([Map, MapView, Point,
                SimpleMarkerSymbol, FeatureLayer, SimpleRenderer]) => {
        
        var self = this;
        var lyr;

        var map = new Map({
          basemap: "dark-gray"
        });

       this.mapView = new MapView({
        center: [-80, 35],
        container: this.mapViewEl.nativeElement,
        map: map,
        zoom: 3
      });

      // Get all points
      this.esriMapService.getAllPoints().subscribe(points => {
        this.points = points;
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
      }, {
        name: "phoneNumber",
        alias: "Phone Number",
        type: "string"
      }, {
        name: "email",
        alias: "email",
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
          }, {
            fieldName: "phoneNumber",
            label: "Phone Number",
            visible: true
          }, {
            fieldName: "email",
            label: "Email",
            visible: true
          }]
        }],
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

        // Request the earthquake data from USGS when the view resolves
        self.esriMapService.getAllPoints()
          .subscribe(points => {
          /* var points = [
            {latitude: -50, longitude: 50, blood_type: "B", contact:{email: 'dassi@yahoo.fr', name: "Dassi Orleando"}}, 
            {latitude: -49.97, longitude: 41.73, blood_type: "A", contact:{email: 'orleando@yahoo.fr', name: "Sajou Orleando"}}
            ]; */

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

          lyr = new FeatureLayer({
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

          map.add(lyr);
        });
      });

    });
  });
}

}