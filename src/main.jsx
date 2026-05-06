import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Pre-load fonts for better UX
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Outfit:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { SessionProvider } from './contexts/SessionContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
