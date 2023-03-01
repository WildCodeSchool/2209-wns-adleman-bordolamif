import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { PROFILE } from '@graphQL/query/userQuery';
import StaffLayout from './layouts/StaffLayout';
import HomePage from '@pages/HomePage';
import AuthPage from '@pages/AuthPage';
import AdminPage from '@pages/admin/AdminPage';
import OperatorBoard from '@pages/operator/OperatorBoard';
import AdminWaitingRoomsAndCountersPage from '@pages/admin/AdminWaitingRoomsAndCountersPage';
import AdminStatisticsPage from '@pages/admin/AdminStatisticsPage';
import AdminUsersPage from '@pages/admin/AdminUsersPage';
import AdminServicesPage from '@pages/admin/AdminServicesPage';
import OperatorPage from '@pages/operator/OperatorPage';
import AdminTicketsPage from '@pages/admin/AdminTicketsPage';

function App() {
  const { data: currentUser, client } = useQuery(PROFILE, { errorPolicy: 'ignore' });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="auth" element={<AuthPage currentUser={currentUser! && currentUser.profile} client={client} />} />
        {currentUser && currentUser!.profile.role === 1
        && (
        <Route path="admin" element={<StaffLayout currentUser={currentUser! && currentUser.profile} client={client} />}>
          <Route index element={<AdminPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="tickets" element={<AdminTicketsPage />} />
          <Route path="waitingroomsandcounters" element={<AdminWaitingRoomsAndCountersPage />} />
          <Route path="statistics" element={<AdminStatisticsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
        )}

        <Route path="operator" element={<OperatorPage />}>
          <Route path="board" element={<OperatorBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
