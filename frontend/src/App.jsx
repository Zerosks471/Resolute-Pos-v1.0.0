import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./helpers/PrivateRoute";
import LoginPage from "./views/LoginPage";
import DashboardLayout from "./views/DashboardLayout";
import DashboardPage from "./views/DashboardPage";
import POSPage from "./views/POSPage";
import OrdersPage from "./views/OrdersPage";
import KitchenPage from "./views/KitchenPage";
import ReservationPage from "./views/ReservationPage";
import CustomersPage from "./views/CustomersPage";
import InvoicesPage from "./views/InvoicesPage";
import UsersPage from "./views/UsersPage";
import ReportsPage from "./views/ReportsPage";
import SettingsPage from "./views/SettingsPage";
import SettingDetailsPage from "./views/SettingsViews/SettingDetailsPage";
import PrintSettingsPage from "./views/SettingsViews/PrintSettingsPage";
import TablesSettingsPage from "./views/SettingsViews/TableSettingsPage";
import MenuItemsSettingsPage from "./views/SettingsViews/MenuItemsSettingsPage";
import TaxSetupPage from "./views/SettingsViews/TaxSetupPage";
import PaymentTypesPage from "./views/SettingsViews/PaymentTypesPage";
import DevicesPage from "./views/SettingsViews/DevicesPage";
import ContactSupport from "./views/SettingsViews/ContactSupportPage";
import CategoriesPage from "./views/SettingsViews/CategoriesPage";
import MenuItemViewPage from "./views/SettingsViews/MenuItemViewPage";
import PrintReceiptPage from "./views/PrintReceiptPage";
import PrintTokenPage from "./views/PrintTokenPage";
import NoAccessPage from "./views/NoAccessPage";
import ProfilePage from "./views/ProfilePage";
import POSSales from "./components/POSSales";
import { NavbarContext } from "./contexts/NavbarContext";
import { getIsNavbarCollapsed } from "./helpers/NavbarSettings";
import { SCOPES } from "./config/scopes";
import ScopeProtectedRoute from "./helpers/ScopeProtectedRoute";
import { SocketProvider } from "./contexts/SocketContext";

export default function App() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(getIsNavbarCollapsed());

  return (
    <SocketProvider>
      <NavbarContext.Provider value={[isNavbarCollapsed, setIsNavbarCollapsed]}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/print-receipt" element={<PrintReceiptPage />} />
            <Route path="/print-token" element={<PrintTokenPage />} />
            <Route path="/no-access" element={<NoAccessPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route
                path=""
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.DASHBOARD]}>
                    <DashboardPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="home"
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.DASHBOARD]}>
                    <DashboardPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route
                path="pos"
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.POS]}>
                    <POSPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <ScopeProtectedRoute
                    scopes={[
                      SCOPES.POS,
                      SCOPES.ORDERS,
                      SCOPES.ORDER_STATUS,
                      SCOPES.ORDER_STATUS_DISPLAY,
                    ]}
                  >
                    <OrdersPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="kitchen"
                element={
                  <ScopeProtectedRoute
                    scopes={[SCOPES.KITCHEN, SCOPES.KITCHEN_DISPLAY]}
                  >
                    <KitchenPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="CustomPOS"
                element={
                  <ScopeProtectedRoute
                    scopes={[
                      SCOPES.POS,
                      SCOPES.ORDERS,
                      SCOPES.ORDER_STATUS,
                      SCOPES.ORDER_STATUS_DISPLAY,
                      SCOPES.CUSTOMER_ORDERS,
                      SCOPES.CUSTOMER_ORDERS_DISPLAY,
                      SCOPES.CUSTOMER_ORDERS_PAYMENT,
                      SCOPES.CUSTOMER_ORDERS_PAYMENT_DISPLAY,
                      SCOPES.CUSTOMER_ORDERS_PAYMENT_PAY,
                      SCOPES.CUSTOMER_ORDERS_PAYMENT_PAY_DISPLAY,
                    ]}
                  >
                    <POSSales />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="reservation"
                element={
                  <ScopeProtectedRoute
                    scopes={[
                      SCOPES.RESERVATIONS,
                      SCOPES.VIEW_RESERVATIONS,
                      SCOPES.MANAGE_RESERVATIONS,
                    ]}
                  >
                    <ReservationPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="customers"
                element={
                  <ScopeProtectedRoute
                    scopes={[
                      SCOPES.CUSTOMERS,
                      SCOPES.VIEW_CUSTOMERS,
                      SCOPES.MANAGE_CUSTOMERS,
                    ]}
                  >
                    <CustomersPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="invoices"
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.INVOICES]}>
                    <InvoicesPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route path="users" element={<ScopeProtectedRoute scopes={[SCOPES.SETTINGS]}><UsersPage /></ScopeProtectedRoute>} />
              <Route
                path="reports"
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.REPORTS]}>
                    <ReportsPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route path="devices" element={<DevicesPage />} />
              <Route path="contact-support" element={<ContactSupport />} />
              <Route
                path="settings"
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.SETTINGS]}>
                    <SettingsPage />
                  </ScopeProtectedRoute>
                }
              >
                <Route path="" element={<SettingDetailsPage />} />
                <Route path="details" element={<SettingDetailsPage />} />
                <Route path="print-settings" element={<PrintSettingsPage />} />
                <Route path="tables" element={<TablesSettingsPage />} />
                <Route path="menu-items" element={<MenuItemsSettingsPage />} />
                <Route path="menu-items/:id" element={<MenuItemViewPage />} />
                <Route path="menu-items/categories" element={<CategoriesPage />} />
                <Route path="tax-setup" element={<TaxSetupPage />} />
                <Route path="payment-types" element={<PaymentTypesPage />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </NavbarContext.Provider>
    </SocketProvider>
  );
}
