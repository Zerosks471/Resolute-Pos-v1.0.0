import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should render card with title', () => {
    component.title = 'Test Card';
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('mat-card-title');
    expect(title.textContent).toContain('Test Card');
  });

  it('should render card content', () => {
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('mat-card-content');
    expect(content).toBeTruthy();
  });
});
