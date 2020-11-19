import React from 'react';
import { Router } from '../pages/Router';
import { RootProvider } from './RootProvider';

export default function App() {
  return (
    <RootProvider>
      <Router />
    </RootProvider>
  );
}
