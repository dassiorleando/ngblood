import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EsriMapService {
  constructor(private http: Http) {
  }

  // Get all saved points
  getAllPoints(){
    return this.http.get('/api')
      .map(res => res.json());
  }

  // Get a point by Id
  getPointById(pointId){
    return this.http.get('/api/point/' + pointId)
      .map(res => res.json());
  }

  // Get point by mapping(x & y)
  getPointByMapping(mapPoint){
    return this.http.post('/api/byMapPoint', mapPoint)
      .map(res => res.json());
  }

  // register a new donor: share blood
  postPoint(point){
    return this.http.post('/api', point)
      .map(res => res.json());
  }

  // update a point
  updatePoint(pointDataToUpdate){
    return this.http.post('/api/point/update', pointDataToUpdate)
      .map(res => res.json());
  }
}