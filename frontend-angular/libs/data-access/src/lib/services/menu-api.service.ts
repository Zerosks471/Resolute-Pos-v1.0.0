import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService, ApiResponse } from './api-client.service';
import { MenuItem, MenuCategory } from '../models/menu-item.model';

@Injectable({
  providedIn: 'root',
})
export class MenuApiService {
  private apiClient = inject(ApiClientService);

  getMenuItems(): Observable<ApiResponse<MenuItem[]>> {
    return this.apiClient.get<ApiResponse<MenuItem[]>>('/menu/items');
  }

  getMenuItemsByCategory(category: MenuCategory): Observable<ApiResponse<MenuItem[]>> {
    return this.apiClient.get<ApiResponse<MenuItem[]>>(`/menu/items/category/${category}`);
  }

  getMenuItemById(id: string): Observable<ApiResponse<MenuItem>> {
    return this.apiClient.get<ApiResponse<MenuItem>>(`/menu/items/${id}`);
  }

  updateMenuItemAvailability(
    id: string,
    available: boolean
  ): Observable<ApiResponse<MenuItem>> {
    return this.apiClient.put<ApiResponse<MenuItem>>(
      `/menu/items/${id}/availability`,
      { available }
    );
  }

  searchMenuItems(searchTerm: string): Observable<ApiResponse<MenuItem[]>> {
    return this.apiClient.get<ApiResponse<MenuItem[]>>(
      `/menu/items/search?q=${searchTerm}`
    );
  }
}
