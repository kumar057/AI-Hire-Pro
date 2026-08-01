import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { AppConfigProvider } from './context/AppConfigContext';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppConfigProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppConfigProvider>
  </StrictMode>,
);

