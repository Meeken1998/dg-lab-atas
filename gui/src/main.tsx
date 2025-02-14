import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'normalize.css';
import "@radix-ui/themes/styles.css";
import './index.css';
import App from './app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
