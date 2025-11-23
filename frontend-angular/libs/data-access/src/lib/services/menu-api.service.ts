import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiClientService, ApiResponse } from './api-client.service';
import { MenuItem, MenuCategory, MenuItemModifier } from '../models/menu-item.model';

// Backend response interface (matches actual API)
interface BackendMenuItem {
  id: number;
  title: string;
  price: string;
  net_price?: string | null;
  tax_id?: number | null;
  tax_title?: string | null;
  tax_rate?: number | null;
  tax_type?: string | null;
  category_id?: number | null;
  category_title?: string | null;
  image?: string | null;
  addons?: Array<{ id: number; item_id: number; title: string; price: string }>;
  variants?: Array<{ id: number; item_id: number; title: string; price: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class MenuApiService {
  private apiClient = inject(ApiClientService);

  private mapBackendItem(item: BackendMenuItem): MenuItem {
    return {
      id: item.id.toString(),
      name: item.title,
      description: '', // Backend doesn't provide description
      category: this.mapCategory(item.category_title),
      price: parseFloat(item.price),
      available: true, // Backend doesn't provide this, default to true
      imageUrl: item.image || undefined,
      modifiers: item.addons?.map(addon => ({
        id: addon.id.toString(),
        name: addon.title,
        priceAdjustment: parseFloat(addon.price),
      })),
    };
  }

  private mapCategory(categoryTitle?: string | null): MenuCategory {
    if (!categoryTitle) return MenuCategory.ENTREES;

    const normalized = categoryTitle.toLowerCase();
    if (normalized.includes('fast')) return MenuCategory.APPETIZERS;
    if (normalized.includes('lunch') || normalized.includes('dinner')) return MenuCategory.ENTREES;
    if (normalized.includes('dessert')) return MenuCategory.DESSERTS;
    if (normalized.includes('drink') || normalized.includes('beverage')) return MenuCategory.BEVERAGES;

    return MenuCategory.ENTREES; // default
  }

  getMenuItems(): Observable<ApiResponse<MenuItem[]>> {
    return this.apiClient.get<BackendMenuItem[]>('/menu-items').pipe(
      map(items => ({
        success: true,
        data: Array.isArray(items) ? items.map(item => this.mapBackendItem(item)) : []
      }))
    );
  }

  getMenuItemsByCategory(category: MenuCategory): Observable<ApiResponse<MenuItem[]>> {
    return this.apiClient.get<BackendMenuItem[]>(`/menu-items/category/${category}`).pipe(
      map(items => ({
        success: true,
        data: Array.isArray(items) ? items.map(item => this.mapBackendItem(item)) : []
      }))
    );
  }

  getMenuItemById(id: string): Observable<ApiResponse<MenuItem>> {
    return this.apiClient.get<BackendMenuItem>(`/menu-items/${id}`).pipe(
      map(item => ({
        success: true,
        data: this.mapBackendItem(item)
      }))
    );
  }

  updateMenuItemAvailability(
    id: string,
    available: boolean
  ): Observable<ApiResponse<MenuItem>> {
    return this.apiClient.put<BackendMenuItem>(
      `/menu-items/${id}/availability`,
      { available }
    ).pipe(
      map(item => ({
        success: true,
        data: this.mapBackendItem(item)
      }))
    );
  }

  searchMenuItems(searchTerm: string): Observable<ApiResponse<MenuItem[]>> {
    return this.apiClient.get<BackendMenuItem[]>(
      `/menu-items/search?q=${searchTerm}`
    ).pipe(
      map(items => ({
        success: true,
        data: Array.isArray(items) ? items.map(item => this.mapBackendItem(item)) : []
      }))
    );
  }
}
