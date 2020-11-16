import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const UpdateUser = React.lazy(() => import('./user/pages/UpdateUser'));
const NewSaber = React.lazy(() => import('./products/pages/NewSaber'));
const NewCrystal = React.lazy(() => import('./products/pages/NewCrystal'));
const UpdateSaber = React.lazy(() => import('./products/pages/UpdateSaber'));

const Sabers = React.lazy(() => import('./products/pages/Sabers'));
const Order = React.lazy(() => import('./products/pages/Orders'));

const Auth = React.lazy(() => import('./user/pages/Auth'));

const App = () => {

  const { token, login, logout, userId,isAdmin,force } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path='/' exact>
        <Sabers />
        </Route>
        <Route path='/saber/order' exact>
          <Order />
        </Route>
  
        <Route path='/sabers/new' exact>
          <NewSaber />
        </Route>
        <Route path='/sabers/crystal/new' exact>
          <NewCrystal />
        </Route>
        <Route path='/user/:userId' exact>
          <UpdateUser />
        </Route>
        <Route path='/sabers/:saberId'>
          <UpdateSaber />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path='/' exact>
        <Auth />
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        <Redirect to='/auth' />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        isAdmin:isAdmin,
        force:force,
        login: login,
        logout: logout, 
      }}
    >
    
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className='center'>
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>

   
    </AuthContext.Provider>
  );
};

export default App;
