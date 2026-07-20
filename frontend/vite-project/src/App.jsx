import React from 'react';
import MainPage from './pages/MainPage';
import Location from './pages/Location'
import Header from './components/Header.jsx';
import Login from './pages/Login'
import Logout from './pages/Logout.jsx';
import Signup from './pages/Signup.jsx';
import Map from './pages/Map'
import User from './pages/User'
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
            <Route path=":locationId" element={<Location/>}></Route>
          </Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="signup" element={<Signup />}></Route>
          <Route path="logout" element={<Logout />}></Route>
          <Route path="map" element={<Map />}></Route>
          <Route path="users" element={<User/>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
