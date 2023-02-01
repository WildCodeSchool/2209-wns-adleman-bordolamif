import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import AuthPage from '@pages/AuthPage';
import CreateUser from '@pages/CreateUser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/create-user" element={<CreateUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
