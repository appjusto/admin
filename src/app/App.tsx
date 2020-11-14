import React from 'react';
import { RootProvider } from './RootProvider';
import { Home } from 'home/Home';

function App() {
  return (
    <RootProvider>
      <Home />
    </RootProvider>
  );
}

export default App;
