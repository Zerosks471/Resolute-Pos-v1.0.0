/**
 * Mock data for testing
 * Provides sample data matching the backend schema
 */

export const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    role: 'admin' as const,
    scopes: ['*'],
    pin: '1234',
  },
  {
    id: '2',
    name: 'Waiter John',
    role: 'waiter' as const,
    scopes: ['pos:order', 'pos:view', 'tables:view'],
    pin: '5678',
  },
  {
    id: '3',
    name: 'Manager Sarah',
    role: 'manager' as const,
    scopes: ['pos:*', 'reports:view', 'tables:*'],
    pin: '9999',
  },
];

export const mockMenuItems = [
  {
    id: '1',
    name: 'Burger',
    price: 12.99,
    category: 'Mains',
    available: true,
  },
  {
    id: '2',
    name: 'Pizza',
    price: 14.99,
    category: 'Mains',
    available: true,
  },
  {
    id: '3',
    name: 'Salad',
    price: 8.99,
    category: 'Starters',
    available: true,
  },
];

export const mockTables = [
  {
    id: '1',
    table_number: 1,
    capacity: 4,
    status: 'available' as const,
  },
  {
    id: '2',
    table_number: 2,
    capacity: 2,
    status: 'occupied' as const,
  },
  {
    id: '3',
    table_number: 3,
    capacity: 6,
    status: 'reserved' as const,
  },
];

export const mockOrders = [
  {
    id: '1',
    table_id: '2',
    status: 'pending' as const,
    total: 27.98,
    items: [
      {
        id: '1',
        menu_item_id: '1',
        quantity: 1,
        price: 12.99,
        name: 'Burger',
      },
      {
        id: '2',
        menu_item_id: '2',
        quantity: 1,
        price: 14.99,
        name: 'Pizza',
      },
    ],
    created_at: new Date().toISOString(),
  },
];

export const mockCategories = [
  { id: '1', name: 'Starters', order: 1 },
  { id: '2', name: 'Mains', order: 2 },
  { id: '3', name: 'Desserts', order: 3 },
  { id: '4', name: 'Drinks', order: 4 },
];
