import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineSync } from './offline-sync';

describe('OfflineSync', () => {
  let component: OfflineSync;
  let fixture: ComponentFixture<OfflineSync>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfflineSync],
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineSync);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
