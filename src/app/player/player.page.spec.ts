import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayerPage } from './player.page';

describe('PlayerPage', () => {
  let component: PlayerPage;
  let fixture: ComponentFixture<PlayerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
