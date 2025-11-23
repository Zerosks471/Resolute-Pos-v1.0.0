import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should render primary button', () => {
    component.variant = 'primary';
    component.label = 'Click me';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Click me');
    expect(button.classList.contains('mat-raised-button')).toBe(true);
  });

  it('should emit click event', () => {
    jest.spyOn(component.clicked, 'emit');
    component.onClick();
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should show spinner when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should not emit click when disabled', () => {
    component.disabled = true;
    jest.spyOn(component.clicked, 'emit');
    component.onClick();
    expect(component.clicked.emit).not.toHaveBeenCalled();
  });

  it('should not emit click when loading', () => {
    component.loading = true;
    jest.spyOn(component.clicked, 'emit');
    component.onClick();
    expect(component.clicked.emit).not.toHaveBeenCalled();
  });

  it('should render secondary variant', () => {
    component.variant = 'secondary';
    component.label = 'Secondary';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Secondary');
    expect(component.getButtonClass()).toBe('mat-raised-button');
  });

  it('should render text variant', () => {
    component.variant = 'text';
    component.label = 'Text Button';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Text Button');
    expect(component.getButtonClass()).toBe('mat-button');
  });
});
