import React, { Suspense, useState } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './components/Auth/Login/Login';

const PrometList = React.lazy(() => {
  return import('./components/Promet/PrometList/PrometList');
});

const PrometDetails = React.lazy(() => {
  return import('./components/Promet/PrometDetails/PrometDetails');
});

const AddPromet = React.lazy(() => {
  return import('./components/Promet/AddPromet/AddPromet');
});

const EditPromet = React.lazy(() => {
  return import('./components/Promet/EditPromet/EditPromet');
});

const Articles = React.lazy(() => {
  return import('./components/Articles/Articles');
});

const DelovniPartneriCreate = React.lazy(() => {
  return import(
    './components/DelovniPartneri/DelovniPartneriCreate/DelovniPartneriCreate'
  );
});

const DelovniPartneriList = React.lazy(() => {
  return import(
    './components/DelovniPartneri/DelovniPartneriList/DelovniPartneriList'
  );
});

const Stavki = React.lazy(() => {
  return import('./components/Stavki/Stavki');
});

const Prikaz = React.lazy(() => {
  return import('./components/Prikaz/Prikaz');
});

const drawerWidth = 240;

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const minWidthForSidebar = useMediaQuery('(min-width:800px)');

  let routes = null;
  let isAuth = localStorage.getItem('token') !== null;

  const handleSidebarOpen = () => {
    console.log('handleSidebarOpen', open);
    setOpen(true);
  };

  const handleSidebarClose = () => {
    console.log('handleSidebarClose', open);
    setOpen(false);
  };

  routes = (
    <Switch>
      <Route
        path='/article/list'
        render={(props) => <Articles {...props} />}
      ></Route>
      <Route
        path='/promet/list'
        render={(props) => <PrometList {...props} />}
      ></Route>
      <Route
        path='/promet/list/:vid'
        render={(props) => <PrometList {...props} />}
      ></Route>
      <Route
        path='/promet/add'
        render={(props) => <AddPromet {...props} />}
      ></Route>
      <Route
        path='/promet/details/:id'
        render={(props) => <PrometDetails {...props} />}
      ></Route>
      <Route
        path='/promet/:id'
        render={(props) => <EditPromet {...props} />}
      ></Route>
      <Route
        path='/delovniPartneri/list'
        render={(props) => <DelovniPartneriList {...props} />}
      ></Route>
      <Route
        path='/delovniPartneri/create'
        render={(props) => <DelovniPartneriCreate {...props} />}
      ></Route>
      <Route
        path='/stavki/list'
        render={(props) => <Stavki {...props} />}
      ></Route>
      <Route path='/prikaz' render={(props) => <Prikaz {...props} />}></Route>
      {/* <Route
        path='/login'
        render={(props) => <Login {...props} />}
      ></Route> */}
      <Redirect to='/promet/list/fakturi' />
    </Switch>
  );

  return isAuth ? (
    <div className={classes.root}>
      <CssBaseline />
      <div className={classes.drawerHeader} />
      {isAuth && (
        <Header
          openSidebar={handleSidebarOpen}
          closeSidebar={handleSidebarClose}
          open={open}
        />
      )}
      {isAuth && minWidthForSidebar && (
        <Sidebar
          openSidebar={handleSidebarOpen}
          closeSidebar={handleSidebarClose}
          open={open}
        />
      )}
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
      </main>
    </div>
  ) : (
    <Login />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default withRouter(App);
