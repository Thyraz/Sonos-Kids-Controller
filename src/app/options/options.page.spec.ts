import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OptionsPage } from './options.page';

describe('OptionsPage', () => {
  let component: OptionsPage;
  let fixture: ComponentFixture<OptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
