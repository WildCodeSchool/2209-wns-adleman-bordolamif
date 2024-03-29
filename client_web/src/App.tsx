import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { PROFILE } from '@graphQL/query/userQuery';
import StaffLayout from './layouts/StaffLayout';
import AuthPage from '@pages/AuthPage';
import AdminPage from '@pages/admin/AdminPage';
import OperatorBoard from '@pages/operator/OperatorBoard';
import AdminWaitingRoomsAndCountersPage from '@pages/admin/AdminWaitingRoomsAndCountersPage';
import AdminUsersPage from '@pages/admin/AdminUsersPage';
import AdminServicesPage from '@pages/admin/AdminServicesPage';
import AdminTicketsPage from '@pages/admin/AdminTicketsPage';
import ClientPage from '@pages/client/ClientPage';
import FirstConnectionPage from '@pages/operator/FirstConnectionPage';
import { RoleEnum } from '@utils/enum/RoleEnum';
import TvScreenPage from '@pages/tv/TvScreenPage';
import MyAccountPage from '@pages/MyAccountPage';
import TvScreenHomePage from '@pages/tv/TvScreenHomePage';
import OperatorStartUpPage from '@pages/operator/OperatorStartUpPage';
import ResetPasswordPage from '@pages/ResetPasswordPage';
import ForgotPasswordPage from '@pages/ForgotPasswordPage';
import AdminStatistics from '@components/adminComponents/AdminStatistics';

function App() {
  const { data: currentUser, client } = useQuery(PROFILE, { errorPolicy: 'ignore' });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={(
            <AuthPage
              currentUser={currentUser! && currentUser.profile}
              client={client}
            />
          )}
        />
        <Route path="/reset-password/:uuid" element={(<ResetPasswordPage />)} />
        <Route
          path="/forgot-password"
          element={(
            <ForgotPasswordPage />
          )}
        />
        {currentUser && currentUser!.profile.role === RoleEnum.ADMINISTRATEUR
          && (
            <Route
              path="admin"
              element={(
                <StaffLayout
                  currentUser={currentUser! && currentUser.profile}
                  client={client}
                />
              )}
            >
              <Route path="dashboard" element={<AdminPage />}>
                <Route path="statistics" element={<AdminStatistics />} />
              </Route>
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="tickets" element={<AdminTicketsPage />} />
              <Route path="waitingroomsandcounters" element={<AdminWaitingRoomsAndCountersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="myaccount" element={<MyAccountPage />} />

            </Route>
          )}
        {currentUser
          && !currentUser!.profile.isFirstLogin
          && currentUser!.profile.role === RoleEnum.OPERATEUR
          && (
            <Route
              path="operator"
              element={(
                <StaffLayout
                  currentUser={currentUser! && currentUser.profile}
                  client={client}
                />
              )}
            >
              <Route path="startup" element={<OperatorStartUpPage />} />
              <Route path="dashboard" element={<OperatorBoard />} />
              <Route path="myaccount" element={<MyAccountPage />} />

            </Route>
          )}
        {currentUser
          && currentUser!.profile.isFirstLogin
          && currentUser!.profile.role === RoleEnum.OPERATEUR
          && (
          <Route path="/firstlogin" element={<FirstConnectionPage currentUser={currentUser.profile} client={client} />} />
          )}
        <Route path="client" element={<ClientPage />} />
        <Route path="tvscreen">
          <Route path="" element={<TvScreenHomePage />} />
          <Route path=":id" element={<TvScreenPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
