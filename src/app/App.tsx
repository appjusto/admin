import React from 'react';
import { RootProvider } from './RootProvider';
import { Router } from './Router';

export default function App() {
  return (
    <RootProvider>
      <Router />
    </RootProvider>
  );
}
