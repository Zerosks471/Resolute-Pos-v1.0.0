import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '@resolute-pos/auth';
import { CartService } from '@resolute-pos/data-access';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: () => number;
}

@Component({
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private platformId = inject(PLATFORM_ID);

  protected title = 'Resolute POS';
  protected isMobile = signal(false);
  protected isTablet = signal(false);
  protected sidenavOpened = signal(true);
  protected currentTime = signal('');
  protected currentDate = signal('');

  protected currentUser$ = this.authService.currentUser$;

  private timeInterval?: number;

  protected navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'POS', icon: 'point_of_sale', route: '/pos', badge: () => this.cartService.itemCount() },
    { label: 'Orders', icon: 'receipt_long', route: '/orders' },
    { label: 'Tables', icon: 'table_restaurant', route: '/tables' },
    { label: 'Menu', icon: 'restaurant_menu', route: '/menu' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  constructor() {
    // Initialize time and date
    this.updateTime();

    // Update time every second (browser only, not during SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.timeInterval = window.setInterval(() => {
        this.updateTime();
      }, 1000);
    }

    // Detect screen size and adjust navigation layout
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .subscribe(result => {
        this.isMobile.set(result.matches);
        this.sidenavOpened.set(!result.matches); // Close sidenav on mobile
      });

    this.breakpointObserver
      .observe([Breakpoints.TabletPortrait, Breakpoints.TabletLandscape])
      .subscribe(result => {
        this.isTablet.set(result.matches);
      });
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime(): void {
    const now = new Date();

    // Format time: HH:MM AM/PM
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    this.currentTime.set(`${displayHours}:${displayMinutes} ${ampm}`);

    // Format date: Mon, Jan 23
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    this.currentDate.set(now.toLocaleDateString('en-US', options));
  }

  protected toggleSidenav(): void {
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  protected navigate(route: string): void {
    this.router.navigate([route]);
    // Close sidenav on mobile after navigation
    if (this.isMobile()) {
      this.sidenavOpened.set(false);
    }
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  protected isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
