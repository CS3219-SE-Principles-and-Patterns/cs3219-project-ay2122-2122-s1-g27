import './App.css';
import React from 'react';
import AuthenticationPage from './pages/AuthenticationPage';
import LandingPage from './pages/LandingPage';
import MatchingPage from './pages/MatchingPage';
import UserProfilePage from './pages/UserProfilePage';
import CollaborationPage from './pages/CollaborationPage';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <Switch>
            <Route path='/about' component={LandingPage} />
            <Route path='/login' component={AuthenticationPage} />
            <Route path='/match' component={MatchingPage} />
            <Route path='/profile' component={UserProfilePage} />
            <Route path='/collaborate' component={CollaborationPage} />
            <Route render={() => <Redirect to={{ pathname: '/about' }} />} />
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
