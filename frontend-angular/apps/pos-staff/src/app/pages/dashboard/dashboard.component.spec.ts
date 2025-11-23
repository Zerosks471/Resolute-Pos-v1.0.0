import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardApiService } from '@resolute-pos/data-access';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockDashboardService: jest.Mocked<DashboardApiService>;

  beforeEach(async () => {
    mockDashboardService = {
      getTodaysMetrics: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, NoopAnimationsModule],
      providers: [
        { provide: DashboardApiService, useValue: mockDashboardService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todays metrics on init', () => {
    const mockMetrics = {
      totalSales: 1250.5,
      orderCount: 42,
      activeTables: 8,
      kitchenQueue: 3,
    };

    mockDashboardService.getTodaysMetrics.mockReturnValue(
      of({ success: true, data: mockMetrics })
    );

    component.ngOnInit();

    expect(mockDashboardService.getTodaysMetrics).toHaveBeenCalled();
    expect(component.metrics).toEqual(mockMetrics);
  });

  it('should handle error when loading metrics', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockDashboardService.getTodaysMetrics.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    component.ngOnInit();

    expect(mockDashboardService.getTodaysMetrics).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should display metrics in the template', () => {
    const mockMetrics = {
      totalSales: 1250.5,
      orderCount: 42,
      activeTables: 8,
      kitchenQueue: 3,
      avgTicket: 29.77,
      comparedToYesterday: 5.5,
    };

    mockDashboardService.getTodaysMetrics.mockReturnValue(
      of({ success: true, data: mockMetrics })
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Dashboard');
  });

  it('should have quick action buttons', () => {
    mockDashboardService.getTodaysMetrics.mockReturnValue(
      of({
        success: true,
        data: {
          totalSales: 0,
          orderCount: 0,
          activeTables: 0,
          kitchenQueue: 0,
        },
      })
    );

    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should cleanup interval on destroy', () => {
    mockDashboardService.getTodaysMetrics.mockReturnValue(
      of({
        success: true,
        data: {
          totalSales: 0,
          orderCount: 0,
          activeTables: 0,
          kitchenQueue: 0,
        },
      })
    );

    component.ngOnInit();
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    component.ngOnDestroy();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });
});
