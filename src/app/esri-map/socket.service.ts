import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketIoService {
  private host: string = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
  private socket: SocketIOClient.Socket; // The client instance of socket.io

  constructor() {
    this.socket = io();
  }

  // Emit blood saved
  emitEventOnBloodSaved(pointSaved){
      this.socket.emit('bloodSaved', pointSaved);
  }

  // Consume blood saved to update 
  consumeEvenOnBloodSaved(){
    this.socket.on('bloodSaved', function(blood){
      console.log(blood);
    });
  }
}