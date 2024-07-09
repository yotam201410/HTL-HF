import React from 'react';
import { ProductCard } from './components/ProductCard'
import { Navbar } from './components/Navabar';

import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </div>
  );
}

export default App;
