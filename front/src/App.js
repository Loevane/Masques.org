import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'


import ScreenHome from './screens/ScreenHome';
import ScreenLogin from './screens/ScreenLogin';
import ScreenMap from './screens/ScreenMap';
import ScreenConfirm from './screens/ScreenConfirm';
import ScreenDashboard from './screens/ScreenDashboard';
import ScreenBasket from './screens/ScreenBasket';
import ScreenFabricant from './screens/ScreenFabricant';
import ScreenProfil from './screens/ScreenProfil';

import userToken from './reducer/user';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

const store = createStore(combineReducers({ userToken }))

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={ScreenHome} path="/" exact />
          <Route component={ScreenLogin} path="/login"/>
          <Route component={ScreenMap} path="/map"/>
          <Route component={ScreenConfirm} path="/confirm"/>
          <Route component={ScreenDashboard} path="/dashboard"/>
          <Route component={ScreenBasket} path="/basket"/>
          <Route component={ScreenFabricant} path="/fabricant"/>
          <Route component={ScreenProfil} path="/profil"/>
        </Switch>
      </Router>
    </Provider>
    
  );
}

export default App;