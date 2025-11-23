# POS-Style Tab Navigation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace sidenav/bottom-nav with traditional POS-style horizontal tab navigation

**Architecture:** Use Material Tabs with custom styling to achieve Square/Toast-like tab navigation. Single compact toolbar with tabs on left, utilities (time/date/user/logout) on right. Horizontal scrollable tabs on mobile.

**Tech Stack:** Angular 20.3, Material Design 3, MatTabsModule, standalone components

---

## Task 1: Update TypeScript - Add MatTabsModule and Remove Sidenav

**Files:**
- Modify: `frontend-angular/apps/pos-staff/src/app/app.ts`

**Step 1: Add MatTabsModule import**

In `app.ts` line 6-11, update imports:

```typescript
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
```

Replace with:

```typescript
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
```

**Step 2: Update component imports array**

In `app.ts` line 22-31, update imports in @Component decorator:

```typescript
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
```

Replace with:

```typescript
imports: [
  CommonModule,
  RouterModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatTabsModule,
],
```

**Step 3: Remove sidenavOpened signal**

In `app.ts` line 46, remove:

```typescript
protected sidenavOpened = signal(true);
```

**Step 4: Add selectedTabIndex computed property**

After the signal declarations (around line 48), add:

```typescript
protected selectedTabIndex = computed(() => {
  const currentRoute = this.router.url;
  const index = this.navItems.findIndex(item =>
    currentRoute.startsWith(item.route)
  );
  return index >= 0 ? index : 0;
});
```

**Step 5: Update breakpoint subscriptions**

In `app.ts` lines 75-86, update the constructor to remove sidenav logic:

```typescript
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
```

Replace with:

```typescript
this.breakpointObserver
  .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
  .subscribe(result => {
    this.isMobile.set(result.matches);
  });

this.breakpointObserver
  .observe([Breakpoints.TabletPortrait, Breakpoints.TabletLandscape])
  .subscribe(result => {
    this.isTablet.set(result.matches);
  });
```

**Step 6: Remove toggleSidenav method**

In `app.ts` lines 111-113, delete:

```typescript
protected toggleSidenav(): void {
  this.sidenavOpened.set(!this.sidenavOpened());
}
```

**Step 7: Replace navigate method with onTabChange**

In `app.ts` lines 115-121, replace:

```typescript
protected navigate(route: string): void {
  this.router.navigate([route]);
  // Close sidenav on mobile after navigation
  if (this.isMobile()) {
    this.sidenavOpened.set(false);
  }
}
```

With:

```typescript
protected onTabChange(index: number): void {
  const selectedItem = this.navItems[index];
  if (selectedItem) {
    this.router.navigate([selectedItem.route]);
  }
}
```

**Step 8: Commit TypeScript changes**

```bash
cd ~/.config/superpowers/worktrees/Resolute-Pos-v1.0.0/pos-tab-navigation
git add frontend-angular/apps/pos-staff/src/app/app.ts
git commit -m "refactor: replace sidenav with tab navigation logic

- Add MatTabsModule, remove MatSidenavModule/MatListModule/MatBadgeModule
- Add selectedTabIndex computed property for route-based tab selection
- Replace navigate() with onTabChange() for tab-based navigation
- Remove sidenavOpened signal and toggleSidenav method
- Clean up breakpoint subscriptions (remove sidenav toggle logic)"
```

---

## Task 2: Update Template - Replace Sidenav with Tab Navigation

**Files:**
- Modify: `frontend-angular/apps/pos-staff/src/app/app.html`

**Step 1: Replace entire navigation structure**

Replace the entire content of `app.html` with:

```html
<!-- Only show navigation for authenticated routes -->
@if (router.url !== '/login' && router.url !== '/unauthorized') {
  <div class="app-container">
    <!-- Combined Toolbar with Tabs and Utilities -->
    <mat-toolbar class="pos-navbar" color="primary">
      <!-- Left: Navigation Tabs -->
      <mat-tab-group
        [selectedIndex]="selectedTabIndex()"
        (selectedIndexChange)="onTabChange($event)"
        class="nav-tabs"
      >
        @for (item of navItems; track item.route) {
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>{{ item.icon }}</mat-icon>
              <span>{{ item.label }}</span>
              @if (item.badge && item.badge() > 0) {
                <span class="tab-badge">{{ item.badge() }}</span>
              }
            </ng-template>
          </mat-tab>
        }
      </mat-tab-group>

      <span class="spacer"></span>

      <!-- Right: Utilities -->
      <div class="navbar-utilities">
        <div class="time-date">
          <span class="time">{{ currentTime() }}</span>
          <span class="date">{{ currentDate() }}</span>
        </div>
        @if (currentUser$ | async; as user) {
          <span class="user-name">{{ user.name }}</span>
        }
        <button
          mat-icon-button
          (click)="logout()"
          aria-label="Logout"
          class="logout-button"
        >
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </mat-toolbar>

    <!-- Main Content -->
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  </div>
} @else {
  <!-- Login and Unauthorized pages (no navigation) -->
  <router-outlet></router-outlet>
}
```

**Step 2: Commit template changes**

```bash
git add frontend-angular/apps/pos-staff/src/app/app.html
git commit -m "refactor: replace sidenav/bottom-nav with tab navigation UI

- Remove mat-sidenav-container and mat-sidenav
- Remove bottom navigation for mobile
- Add mat-tab-group with tab labels containing icons and badges
- Move utilities (time/date/user/logout) to right side of toolbar
- Simplify structure: toolbar + tabs + content"
```

---

## Task 3: Update Styles - Add POS Tab Styling

**Files:**
- Modify: `frontend-angular/apps/pos-staff/src/app/app.scss`

**Step 1: Replace entire stylesheet with POS styling**

Replace the entire content of `app.scss` with:

```scss
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.pos-navbar {
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .nav-tabs {
    flex: 1;
    height: 100%;

    // Remove Material's bottom border
    ::ng-deep .mat-mdc-tab-header {
      border-bottom: none;
    }

    // Make tabs look like POS buttons
    ::ng-deep .mat-mdc-tab {
      min-width: 100px;
      height: 64px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      // Icon + label horizontal layout
      .mat-mdc-tab-label-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    // Active tab indicator - bold underline
    ::ng-deep .mdc-tab-indicator__content {
      border-top-width: 3px;
      border-color: white;
    }

    // Custom badge styling
    .tab-badge {
      background: #ff4444;
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      margin-left: 4px;
    }
  }

  .spacer {
    flex: 1 1 auto;
  }

  .navbar-utilities {
    display: flex;
    align-items: center;
    gap: 16px;

    .time-date {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .time {
        font-size: 16px;
        font-weight: 500;
      }

      .date {
        font-size: 12px;
        opacity: 0.9;
      }
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.main-content {
  flex: 1;
  overflow: auto;
}

// Mobile adjustments
@media (max-width: 768px) {
  .pos-navbar {
    padding: 0 8px;

    .nav-tabs ::ng-deep .mat-mdc-tab {
      min-width: 80px;
      font-size: 13px;
    }

    .navbar-utilities {
      gap: 8px;

      .time-date .date {
        display: none; // Hide date on mobile
      }
    }
  }
}
```

**Step 2: Commit style changes**

```bash
git add frontend-angular/apps/pos-staff/src/app/app.scss
git commit -m "style: add POS-style tab navigation styling

- Uppercase tab labels with 500 weight and letter spacing
- Bold 3px white bottom border for active tab
- Custom red badge circles for cart count
- Horizontal icon + label layout in tabs
- Responsive adjustments for mobile (hide date, smaller tabs)
- Remove Material's default tab bottom border"
```

---

## Task 4: Run Tests to Verify Changes

**Files:**
- Test: All test files (no modifications needed)

**Step 1: Run full test suite**

```bash
cd ~/.config/superpowers/worktrees/Resolute-Pos-v1.0.0/pos-tab-navigation/frontend-angular
npx nx test pos-staff --watch=false
```

**Expected output:**
```
Test Suites: 7 passed, 7 total
Tests:       74 passed, 74 total
```

**Step 2: If tests fail, investigate and fix**

Common issues:
- Import errors: Verify MatTabsModule is imported in app.ts
- Template errors: Check mat-tab-group syntax and bindings
- Missing methods: Verify onTabChange and selectedTabIndex exist

**Step 3: Commit if any test fixes were needed**

```bash
# Only if fixes were required
git add <fixed-files>
git commit -m "test: fix tests after tab navigation refactor"
```

---

## Task 5: Manual Testing in Browser

**Files:**
- None (manual verification)

**Step 1: Start dev server**

```bash
cd ~/.config/superpowers/worktrees/Resolute-Pos-v1.0.0/pos-tab-navigation/frontend-angular
npx nx serve pos-staff
```

**Step 2: Navigate to http://localhost:4200 and verify:**

- [ ] Login page displays without navigation
- [ ] After login with PIN 1234, dashboard shows tab navigation
- [ ] Tabs display horizontally with icons and labels
- [ ] Active tab has white bottom border
- [ ] Clicking tabs navigates to correct routes
- [ ] Browser back/forward updates selected tab
- [ ] Time/date/user/logout display on right side
- [ ] POS tab shows cart badge when items added
- [ ] On mobile (resize browser <768px), tabs scroll horizontally
- [ ] On mobile, date is hidden (only time shows)
- [ ] All routes accessible: Dashboard, POS, Orders, Tables, Menu, Settings

**Step 3: Test responsiveness**

Resize browser to test:
- Desktop (>1024px): All tabs visible
- Tablet (768-1024px): Tabs may scroll
- Mobile (<768px): Tabs scroll, date hidden

**Step 4: Document any issues found**

If bugs found, create issues in a temporary file:
```bash
echo "## Issues Found" > /tmp/tab-nav-issues.md
echo "- Issue description" >> /tmp/tab-nav-issues.md
```

---

## Task 6: Final Commit and Verification

**Files:**
- All modified files

**Step 1: Review all changes**

```bash
cd ~/.config/superpowers/worktrees/Resolute-Pos-v1.0.0/pos-tab-navigation
git log --oneline -5
git diff main
```

**Step 2: Run final test suite**

```bash
cd frontend-angular
npx nx test pos-staff --watch=false
```

**Expected:** All 74 tests passing

**Step 3: Verify no untracked files**

```bash
git status
```

**Expected:** Clean working directory or only expected changes

**Step 4: Create summary commit if needed**

```bash
# Only if there are uncommitted changes
git add .
git commit -m "chore: final cleanup for POS tab navigation"
```

---

## Verification Checklist

Before completing:

- [ ] All TypeScript changes committed
- [ ] Template fully replaced with tab navigation
- [ ] Styles applied for POS aesthetic
- [ ] All 74 tests passing
- [ ] Manual testing complete
- [ ] Tabs navigate correctly
- [ ] Active tab highlights properly
- [ ] Cart badge displays on POS tab
- [ ] Responsive behavior works
- [ ] Time/date/user/logout visible
- [ ] No console errors
- [ ] Clean git status

---

## Next Steps

After implementation:

1. **Code Review:** Use @superpowers:requesting-code-review to validate implementation
2. **Merge Strategy:** Use @superpowers:finishing-a-development-branch to decide merge approach
3. **User Acceptance:** Demo to user and gather feedback
4. **Documentation:** Update CLAUDE.md if navigation patterns changed
