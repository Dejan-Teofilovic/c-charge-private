import React from 'react';
import { useRoutes } from 'react-router';
import Home from './pages/Home';

export default function Routes() {
  return useRoutes([
    {
      path: '/',
      element: <Home />
    }
  ]);
}