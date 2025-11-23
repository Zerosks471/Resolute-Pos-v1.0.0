/**
 * Menu item models for POS system
 */

export enum MenuCategory {
  APPETIZERS = 'appetizers',
  ENTREES = 'entrees',
  SIDES = 'sides',
  DESSERTS = 'desserts',
  BEVERAGES = 'beverages',
  SPECIALS = 'specials',
}

export interface MenuItemModifier {
  id: string;
  name: string;
  priceAdjustment: number;
  available?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  available: boolean;
  imageUrl?: string;
  prepTime?: number; // in minutes
  allergens?: string[];
  modifiers?: MenuItemModifier[];
}
