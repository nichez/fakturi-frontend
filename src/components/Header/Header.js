import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';

const drawerWidth = 240;

const Header = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const { openSidebar, open } = props;

  const [username, setUsername] = useState(localStorage.getItem('username'));

  const redirectToLogin = () => {
    let path = '/';
    history.replace(path);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    redirectToLogin();
  };

  return (
    <AppBar
      position='fixed'
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar className={classes.toolbarContainer}>
        <div className={classes.toolbarLeftSide}>
          <IconButton
            aria-label='open drawer'
            onClick={openSidebar}
            edge='start'
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <img
            src='/assets/images/logo-placeholder.jpg'
            alt='logo'
            style={{ width: 60, height: 60 }}
          />
          <Typography variant='h6' noWrap className={classes.textColor}>
            Ime Na Firma
          </Typography>
        </div>
        <div className={classes.toolbarRightSide}>
          <div className={classes.username}>
            <Typography variant='body2' noWrap className={classes.textColor}>
              Hello {username}
            </Typography>
          </div>
          <Button color='primary' type='button' fullWidth onClick={logout}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: theme.palette.primary.contrastText,
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  toolbarLeftSide: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  textColor: {
    color: theme.palette.primary.main,
  },
  toolbarRightSide: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    marginRight: 20,
  },
}));

export default Header;
