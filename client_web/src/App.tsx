import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import AuthPage from '@pages/AuthPage';
import AdminPage from '@pages/AdminPage';
import OperatorBoard from '@pages/OperatorBoard';
import OperatorPage from '@pages/OperatorPage';
import AdminServicesPage from '@pages/AdminServicesPage';
import AdminWaitingRoomsAndCountersPage from '@pages/AdminWaitingRoomsAndCountersPage';
import AdminStatisticsPage from '@pages/AdminStatisticsPage';
import StaffLayout from './layouts/StaffLayout';
import { useQuery } from '@apollo/client';
import { PROFILE } from '@graphQL/query/userQuery';
import AdminUsersPage from '@pages/AdminUsersPage';

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
