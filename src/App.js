import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Homepage from './components/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="home" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
