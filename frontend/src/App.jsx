import { React } from 'react';
// import { React, useContext, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import StoreProvider from './utils/store';
// import StoreProvider, { StoreContext } from './utils/store';

import LoginRegisterPage from './pages/login/LoginRegisterPage'
// import RegisterPage from './pages/login/RegisterPage'
import MainPage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import HostingPage from './pages/hosting/HostingPage';
import AddHostingPage from './pages/hosting/AddHostingPage';
import EditHostingPage from './pages/hosting/EditHostingPage';
import ListingPage from './pages/listing/ListingPage';
import BookingsPage from './pages/hosting/BookingsPage';

function App () {
  return (
    <>
      <StoreProvider>
        <Router>
          <Switch>
            <Route path="/login">
              <LoginRegisterPage pageMode='Login'/>
            </Route>
            <Route path="/register">
              <LoginRegisterPage pageMode='Register'/>
            </Route>
            <Route path="/hostings/add" component = {AddHostingPage}></Route>
            <Route path="/hostings/bookings/:hostingId" component = {BookingsPage}></Route>
            <Route path="/hostings/edit/:hostingId" component = {EditHostingPage}></Route>
            <Route path="/hostings" component = {HostingPage}></Route>
            <Route path="/listings/:listingId" component = {ListingPage}></Route>
            <Route path="/search" component = {SearchPage}></Route>
            <Route path="/" component = {MainPage}></Route>
          </Switch>
        </Router>
      </StoreProvider>
    </>
  );
}

export default App;
