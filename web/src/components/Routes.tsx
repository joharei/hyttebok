import * as React from 'react';
import { Route, Routes } from 'react-router';
import { AdminPage } from './AdminPage';
import { ResponsiveDrawer } from './ResponsiveDrawer';

export const AppRoutes: React.FunctionComponent = () => (
  <Routes>
    <Route path="/*" element={<ResponsiveDrawer />} />
    <Route path="trip/*" element={<ResponsiveDrawer />} />
    <Route path="admin/*" element={<AdminPage />} />
  </Routes>
);
