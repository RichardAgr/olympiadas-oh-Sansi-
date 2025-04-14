import ReactDOM from 'react-dom/client';
import AppRouter from './routes/AppRouter';
import {StrictMode} from 'react';
import './index.css';
import './styleAdmArea.css';




ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
