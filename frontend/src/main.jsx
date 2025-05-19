import ReactDOM from 'react-dom/client';
import AppRouterLogin from './routes/AppRouteLogin';
import HomePrincipalRoutes from './routes/HomePrincipalRoutes';
import {StrictMode} from 'react';
import './index.css';
import './styleAdmArea.css';
import { BrowserRouter } from 'react-router-dom';




ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <HomePrincipalRoutes />
    </BrowserRouter>
  </StrictMode>,
);
