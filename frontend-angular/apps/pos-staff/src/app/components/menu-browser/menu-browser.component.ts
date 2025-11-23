import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MenuItem,
  MenuCategory,
  loadMenuItems,
  selectAllMenuItems,
  selectMenuLoading,
  selectMenuError,
} from '@resolute-pos/data-access';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-menu-browser',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './menu-browser.component.html',
  styleUrls: ['./menu-browser.component.scss'],
})
export class MenuBrowserComponent implements OnInit {
  private store = inject(Store);

  @Input() selectedCategory?: MenuCategory;
  @Input() searchTerm?: string;
  @Output() itemSelected = new EventEmitter<MenuItem>();

  // State from store
  menuItems = toSignal(this.store.select(selectAllMenuItems), {
    initialValue: [],
  });
  loading$ = this.store.select(selectMenuLoading);
  error$ = this.store.select(selectMenuError);

  // Computed filtered items
  filteredItems = computed(() => {
    let items = this.menuItems();

    // Filter by category if provided
    if (this.selectedCategory) {
      items = items.filter((item) => item.category === this.selectedCategory);
    }

    // Filter by search term if provided
    if (this.searchTerm && this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }

    return items;
  });

  ngOnInit(): void {
    // Load menu items on component initialization
    this.store.dispatch(loadMenuItems());
  }

  selectItem(item: MenuItem): void {
    // Only emit selection for available items
    if (this.isItemAvailable(item)) {
      this.itemSelected.emit(item);
    }
  }

  isItemAvailable(item: MenuItem): boolean {
    return item.available;
  }

  getImageUrl(item: MenuItem): string {
    return item.imageUrl || '/assets/placeholder.jpg';
  }
}
