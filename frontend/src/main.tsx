import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { AppConfigProvider } from './context/AppConfigContext';
import { AuthProvider } from './context/AuthProvider';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppConfigProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              className:
                'border border-slate-200 bg-white text-slate-950 shadow-xl dark:border-white/10 dark:bg-slate-900 dark:text-white',
              duration: 4200,
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </AppConfigProvider>
  </StrictMode>,
);
