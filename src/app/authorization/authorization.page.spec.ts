import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuthorizationPage } from './authorization.page';

describe('AuthorizationPage', () => {
  let component: AuthorizationPage;
  let fixture: ComponentFixture<AuthorizationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorizationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
