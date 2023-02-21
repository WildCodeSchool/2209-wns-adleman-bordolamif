import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import AuthPage from '@pages/AuthPage';
import AdminPage from '@pages/AdminPage';
import OperatorBoard from '@pages/OperatorBoard';
import OperatorPage from '@pages/OperatorPage';
import AdminServicesPage from '@pages/AdminServicesPage';
import AdminCountersPage from '@pages/AdminCountersPage';
import AdminStatisticsPage from '@pages/AdminStatisticsPage';
import UsersPage from '@pages/UsersPage';
import StaffLayout from './layouts/StaffLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="admin" element={<StaffLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="counters" element={<AdminCountersPage />} />
          <Route path="statistics" element={<AdminStatisticsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        <Route path="operator" element={<OperatorPage />}>
          <Route path="board" element={<OperatorBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
