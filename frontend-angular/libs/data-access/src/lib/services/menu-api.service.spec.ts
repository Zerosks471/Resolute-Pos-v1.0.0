import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MenuApiService } from './menu-api.service';
import { ApiClientService } from './api-client.service';
import { MenuItem, MenuCategory } from '../models/menu-item.model';

describe('MenuApiService', () => {
  let service: MenuApiService;
  let apiClient: ApiClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MenuApiService,
        ApiClientService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(MenuApiService);
    apiClient = TestBed.inject(ApiClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all menu items', (done) => {
    const mockMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Burger',
        description: 'Delicious burger',
        category: MenuCategory.ENTREES,
        price: 12.99,
        available: true,
      },
      {
        id: '2',
        name: 'Fries',
        description: 'Crispy fries',
        category: MenuCategory.SIDES,
        price: 4.99,
        available: true,
      },
    ];

    const mockResponse = { success: true, data: mockMenuItems };

    jest.spyOn(apiClient, 'get').mockReturnValue(of(mockResponse));

    service.getMenuItems().subscribe((response) => {
      expect(apiClient.get).toHaveBeenCalledWith('/menu/items');
      expect(response).toEqual(mockResponse);
      expect(response.data).toEqual(mockMenuItems);
      done();
    });
  });

  it('should get menu items by category', (done) => {
    const category = MenuCategory.ENTREES;
    const mockMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Burger',
        description: 'Delicious burger',
        category: MenuCategory.ENTREES,
        price: 12.99,
        available: true,
      },
    ];

    const mockResponse = { success: true, data: mockMenuItems };

    jest.spyOn(apiClient, 'get').mockReturnValue(of(mockResponse));

    service.getMenuItemsByCategory(category).subscribe((response) => {
      expect(apiClient.get).toHaveBeenCalledWith(`/menu/items/category/${category}`);
      expect(response).toEqual(mockResponse);
      expect(response.data).toEqual(mockMenuItems);
      done();
    });
  });

  it('should get menu item by id', (done) => {
    const itemId = '1';
    const mockMenuItem: MenuItem = {
      id: '1',
      name: 'Burger',
      description: 'Delicious burger',
      category: MenuCategory.ENTREES,
      price: 12.99,
      available: true,
    };

    const mockResponse = { success: true, data: mockMenuItem };

    jest.spyOn(apiClient, 'get').mockReturnValue(of(mockResponse));

    service.getMenuItemById(itemId).subscribe((response) => {
      expect(apiClient.get).toHaveBeenCalledWith(`/menu/items/${itemId}`);
      expect(response).toEqual(mockResponse);
      expect(response.data).toEqual(mockMenuItem);
      done();
    });
  });

  it('should update menu item availability', (done) => {
    const itemId = '1';
    const available = false;
    const mockMenuItem: MenuItem = {
      id: '1',
      name: 'Burger',
      description: 'Delicious burger',
      category: MenuCategory.ENTREES,
      price: 12.99,
      available: false,
    };

    const mockResponse = { success: true, data: mockMenuItem };

    jest.spyOn(apiClient, 'put').mockReturnValue(of(mockResponse));

    service.updateMenuItemAvailability(itemId, available).subscribe((response) => {
      expect(apiClient.put).toHaveBeenCalledWith(
        `/menu/items/${itemId}/availability`,
        { available }
      );
      expect(response).toEqual(mockResponse);
      expect(response.data?.available).toBe(false);
      done();
    });
  });

  it('should search menu items', (done) => {
    const searchTerm = 'burger';
    const mockMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Burger',
        description: 'Delicious burger',
        category: MenuCategory.ENTREES,
        price: 12.99,
        available: true,
      },
    ];

    const mockResponse = { success: true, data: mockMenuItems };

    jest.spyOn(apiClient, 'get').mockReturnValue(of(mockResponse));

    service.searchMenuItems(searchTerm).subscribe((response) => {
      expect(apiClient.get).toHaveBeenCalledWith(`/menu/items/search?q=${searchTerm}`);
      expect(response).toEqual(mockResponse);
      expect(response.data).toEqual(mockMenuItems);
      done();
    });
  });
});
