import React, { Suspense, useState } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

const PrometList = React.lazy(() => {
  return import('./components/Promet/PrometList/PrometList');
});

const PrometDetails = React.lazy(() => {
  return import('./components/Promet/InvoiceDetails');
});

const Articles = React.lazy(() => {
  return import('./components/Articles/Articles');
});

const DelovniPartneriCreate = React.lazy(() => {
  return import('./components/DelovniPartneri/DelovniPartneriCreate/DelovniPartneriCreate');
});

const DelovniPartneriList = React.lazy(() => {
  return import('./components/DelovniPartneri/DelovniPartneriList/DelovniPartneriList');
});

const drawerWidth = 240;

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const minWidthForSidebar = useMediaQuery('(min-width:800px)');

  let routes = null;
  let isAuth = true;

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
        path='/promet/:id'
        render={(props) => <PrometDetails {...props} />}
      ></Route>
      <Route
        path='/delovniPartneri/list'
        render={(props) => <DelovniPartneriList {...props} />}
      ></Route>
      <Route
        path='/delovniPartneri/create'
        render={(props) => <DelovniPartneriCreate {...props} />}
      ></Route>
      <Redirect to='/promet/list' />
    </Switch>
  );

  return (
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
      {minWidthForSidebar && (
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
