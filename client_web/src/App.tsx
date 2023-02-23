import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import AuthPage from '@pages/AuthPage';
import CreateUser from '@components/CreateUser';
import AdminPage from '@pages/AdminPage';
import OperatorBoard from '@pages/OperatorBoard';
import OperatorPage from '@pages/OperatorPage';
import AdminServicesPage from '@pages/AdminServicesPage';
import AdminCountersPage from '@pages/AdminCountersPage';
import AdminStatisticsPage from '@pages/AdminStatisticsPage';
import UsersPage from '@pages/UsersPage';
import UpdateUser from '@components/UpdateUser';
import DeleteUser from '@components/DeleteUser';
import StaffLayout from './layouts/StaffLayout';
import { useQuery } from '@apollo/client';
import { PROFILE } from '@graphQL/query/userQuery';

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
          <Route path="counters" element={<AdminCountersPage />} />
          <Route path="statistics" element={<AdminStatisticsPage />} />
          <Route path="users" element={<UsersPage />}>
            <Route path="create" element={<CreateUser />} />
            <Route path="update" element={<UpdateUser />} />
            <Route path="delete" element={<DeleteUser />} />
          </Route>
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
