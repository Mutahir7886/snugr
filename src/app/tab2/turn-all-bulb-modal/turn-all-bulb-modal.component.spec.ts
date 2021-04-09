import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TurnAllBulbModalComponent } from './turn-all-bulb-modal.component';

describe('TurnAllBulbModalComponent', () => {
  let component: TurnAllBulbModalComponent;
  let fixture: ComponentFixture<TurnAllBulbModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnAllBulbModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TurnAllBulbModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
