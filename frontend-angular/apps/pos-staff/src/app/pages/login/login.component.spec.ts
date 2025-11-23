import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '@resolute-pos/auth';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const authServiceMock = {
      loginWithPin: jest.fn(),
    };
    const routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('PIN entry', () => {
    it('should add digit to PIN when digit button clicked', () => {
      component.addDigit('5');
      expect(component.pin).toBe('5');
    });

    it('should add multiple digits in sequence', () => {
      component.addDigit('1');
      component.addDigit('2');
      component.addDigit('3');
      expect(component.pin).toBe('123');
    });

    it('should not add more than 6 digits', () => {
      component.addDigit('1');
      component.addDigit('2');
      component.addDigit('3');
      component.addDigit('4');
      component.addDigit('5');
      component.addDigit('6');
      component.addDigit('7'); // Should be ignored
      expect(component.pin).toBe('123456');
    });

    it('should clear PIN when clear is called', () => {
      component.addDigit('1');
      component.addDigit('2');
      component.clearPin();
      expect(component.pin).toBe('');
    });

    it('should return masked PIN display', () => {
      component.addDigit('1');
      component.addDigit('2');
      component.addDigit('3');
      expect(component.getMaskedPin()).toBe('•••');
    });
  });

  describe('PIN submission', () => {
    it('should disable submit when PIN is empty', () => {
      expect(component.canSubmit()).toBe(false);
    });

    it('should disable submit when PIN is less than 4 digits', () => {
      component.addDigit('1');
      component.addDigit('2');
      component.addDigit('3');
      expect(component.canSubmit()).toBe(false);
    });

    it('should enable submit when PIN is 4 or more digits', () => {
      component.addDigit('1');
      component.addDigit('2');
      component.addDigit('3');
      component.addDigit('4');
      expect(component.canSubmit()).toBe(true);
    });

    it('should call authService.loginWithPin on submit', async () => {
      authService.loginWithPin.mockReturnValue(
        of({ success: true, user: { id: 1, username: 'test', scopes: [] } })
      );
      component.addDigit('1');
      component.addDigit('2');
      component.addDigit('3');
      component.addDigit('4');

      await component.submit();

      expect(authService.loginWithPin).toHaveBeenCalledWith('1234');
    });

    it('should navigate to dashboard on successful login', async () => {
      authService.loginWithPin.mockReturnValue(
        of({ success: true, user: { id: 1, username: 'test', scopes: [] } })
      );
      component.addDigit('1');
      component.addDigit('2');
      component.addDigit('3');
      component.addDigit('4');

      await component.submit();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should clear PIN on successful login', async () => {
      authService.loginWithPin.mockReturnValue(
        of({ success: true, user: { id: 1, username: 'test', scopes: [] } })
      );
      component.addDigit('1');
      component.addDigit('2');
      component.addDigit('3');
      component.addDigit('4');

      await component.submit();

      expect(component.pin).toBe('');
    });

    it('should set error message on failed login', async () => {
      authService.loginWithPin.mockReturnValue(
        throwError(() => new Error('Invalid PIN'))
      );
      component.addDigit('1');
      component.addDigit('2');
      component.addDigit('3');
      component.addDigit('4');

      await component.submit();

      expect(component.errorMessage).toBe('Invalid PIN');
    });

    it('should not clear PIN on failed login', async () => {
      authService.loginWithPin.mockReturnValue(
        throwError(() => new Error('Invalid PIN'))
      );
      component.addDigit('1');
      component.addDigit('2');
      component.addDigit('3');
      component.addDigit('4');

      await component.submit();

      expect(component.pin).toBe('1234');
    });

    it('should clear error message when adding new digit', () => {
      component.errorMessage = 'Invalid PIN';
      component.addDigit('5');
      expect(component.errorMessage).toBe(null);
    });
  });
});
