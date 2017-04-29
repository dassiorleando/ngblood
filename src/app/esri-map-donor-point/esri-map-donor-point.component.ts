import { ToasterService } from 'angular2-toaster';
import { SocketIoService } from '../esri-map/socket.service';
import { EsriMapService } from '../esri-map/esri-map.service';
import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-esri-map-donor-point',
  templateUrl: './esri-map-donor-point.component.html',
  styleUrls: ['./esri-map-donor-point.component.css']
})
export class EsriMapDonorPointComponent implements OnInit {
  private point:any = {
    contact:{}
  };
  // All available blood type
  blood_types = [
    'A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'
  ];

  constructor(private esriMapService:EsriMapService, private route: ActivatedRoute,
              private router: Router, private socketIoService: SocketIoService,
              private toasterService: ToasterService) { }

  ngOnInit() {
    // We get all info of this point from the backend
      this.route.params
    // (+) converts string 'id' to a number
    .switchMap((params: Params) => this.esriMapService.getPointById(params['pointId']))
    .subscribe((point: any) => this.point = point);
  }

  /**
   * Redirect to the index page
   */
  goToIndex(){
    this.router.navigate(['/']);
  }

  /**
   * Update the current point
   */
  updateCurrentPoint(){
    this.esriMapService.postPoint(this.point).subscribe(updatedPoint => {
      if(updatedPoint){
        this.point = updatedPoint;
        this.socketIoService.emitEventOnBloodUpdated(updatedPoint); // Emit event
      } else{
          // On error, tell the user to try gain
          this.toasterService.pop('error', 'ERROR WHEN UPDATING BLOOD',
          'An error occured when updating your blood, please try again');
        }
    });

  }

}
