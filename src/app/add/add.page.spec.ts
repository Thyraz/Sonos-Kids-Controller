import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddPage } from './add.page';

describe('AddPage', () => {
  let component: AddPage;
  let fixture: ComponentFixture<AddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
