import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import AuthPage from '@pages/AuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
