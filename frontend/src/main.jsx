import ReactDOM from 'react-dom/client';
import AppRouterLogin from './routes/AppRouteLogin';
import {StrictMode} from 'react';
import './index.css';
import './styleAdmArea.css';
import { BrowserRouter } from 'react-router-dom';




ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AppRouterLogin />
    </BrowserRouter>
  </StrictMode>,
);
