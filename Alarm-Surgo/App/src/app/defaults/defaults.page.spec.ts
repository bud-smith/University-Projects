import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DefaultsPage } from './defaults.page';

describe('DefaultsPage', () => {
  let component: DefaultsPage;
  let fixture: ComponentFixture<DefaultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
