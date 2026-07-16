import React from 'react';
import MainPage from './pages/MainPage';
import Location from './pages/Location'
import Header from './components/Header.jsx';
import Login from './pages/Login'
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/">
          <Route index element={<MainPage />} />
          <Route path="measurements">
            <Route path=":location" element={<Location/>}></Route>
          </Route>
          <Route path="login" element={<Login />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;