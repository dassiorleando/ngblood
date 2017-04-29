import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsriMapDonorPointComponent } from './esri-map-donor-point.component';

describe('EsriMapDonorPointComponent', () => {
  let component: EsriMapDonorPointComponent;
  let fixture: ComponentFixture<EsriMapDonorPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsriMapDonorPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsriMapDonorPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
