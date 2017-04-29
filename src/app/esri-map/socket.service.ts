import { Injectable, EventEmitter } from '@angular/core';
import {CustomPoint} from './esri-map-point.component';
import * as io from 'socket.io-client';
import {ToasterService} from 'angular2-toaster';

@Injectable()
export class SocketIoService {
  public pointShared$: EventEmitter<CustomPoint>;
  private lastPoint: CustomPoint = null;
  private socket: SocketIOClient.Socket; // The client instance of socket.io

  constructor(private toasterService: ToasterService) {
    this.socket = io();
    this.pointShared$ = new EventEmitter();
  }

  public add(item: CustomPoint): void {
    this.lastPoint = item;
    this.pointShared$.emit(item);
  }

  // Emit blood saved
  emitEventOnBloodSaved(pointSaved){
      this.socket.emit('bloodSaved', pointSaved);
  }

  emitEventOnBloodUpdated(pointUpdated){
    this.socket.emit('bloodUpdated', pointUpdated);
  }

  // Consume blood saved to update 
  consumeEvenOnBloodSaved(){
    var self = this;
    this.socket.on('bloodSaved', function(blood){
      self.toasterService.pop('success', 'NEW BLOOD SHARED', 
          'A blood of type ' + blood.blood_type + ' has just been shared' + ' at ' + blood.address);
      self.add(new CustomPoint(blood.longitude, blood.latitude,
          blood.contact.firstName, blood.contact.lastName, blood.contact.phoneNumber, 
          blood.contact.email, blood.blood_type, blood.address));
    });
  }

  // Consume on blood updated 
  consumeEvenOnBloodUpdated(){
    var self = this;
    this.socket.on('bloodUpdated', function(blood){
      self.toasterService.pop('info', 'BLOOD UPDATED', 
          'A blood of type ' + blood.blood_type + ' has just been updated' + ' at ' + blood.address);
    });
  }
}