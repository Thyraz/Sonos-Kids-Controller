import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MedialistPage } from './medialist.page';

describe('MedialistPage', () => {
  let component: MedialistPage;
  let fixture: ComponentFixture<MedialistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedialistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MedialistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
