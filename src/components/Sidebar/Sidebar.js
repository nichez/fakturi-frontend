import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ViewListIcon from '@material-ui/icons/ViewList';
import GroupIcon from '@material-ui/icons/Group';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ListAltIcon from '@material-ui/icons/ListAlt';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FindInPageIcon from '@material-ui/icons/FindInPage';

const drawerWidth = 240;

const Sidebar = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();

  const { closeSidebar, open } = props;

  return (
    <Drawer
      className={classes.drawer}
      variant='persistent'
      anchor='left'
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={closeSidebar}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon className={classes.icon} />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>
        <List>
          <NavLink to='/article/list' className={classes.link}>
            <ListItem
              button
              key={1}
              selected={location.pathname === '/article/list'}
              style={{
                backgroundColor:
                  location.pathname === '/article/list'
                    ? 'rgba(223, 242, 239, 0.7)'
                    : null,
                color:
                  location.pathname === '/article/list'
                    ? 'rgb(12, 19, 20)'
                    : null,
                borderRadius: 10,
                marginRight: location.pathname === '/article/list' ? 20 : 0,
              }}
            >
              <ListItemIcon className={classes.icon}>
                <ViewListIcon
                  color={location.pathname === '/article/list' ? 'primary' : ''}
                />
              </ListItemIcon>
              <ListItemText primary='Artikli' />
            </ListItem>
          </NavLink>

          <NavLink to='/delovniPartneri/list' className={classes.link}>
            <ListItem
              button
              key={1}
              selected={location.pathname === '/delovniPartneri/list'}
              style={{
                backgroundColor:
                  location.pathname === '/delovniPartneri/list'
                    ? 'rgba(223, 242, 239, 0.7)'
                    : null,
                color:
                  location.pathname === '/delovniPartneri/list'
                    ? 'rgb(12, 19, 20)'
                    : null,
                borderRadius: 10,
              }}
            >
              <ListItemIcon className={classes.icon}>
                <GroupIcon
                  color={
                    location.pathname === '/delovniPartneri/list'
                      ? 'primary'
                      : ''
                  }
                />
              </ListItemIcon>
              <ListItemText primary='Delovni Partneri' />
            </ListItem>
          </NavLink>

          <NavLink
            to={{ pathname: '/promet/list/fakturi' }}
            className={classes.link}
          >
            <ListItem
              button
              key={1}
              selected={location.pathname === '/promet/list/fakturi'}
              style={{
                backgroundColor:
                  location.pathname === '/promet/list/fakturi'
                    ? 'rgba(223, 242, 239, 0.7)'
                    : null,
                color:
                  location.pathname === '/promet/list/fakturi'
                    ? 'rgb(12, 19, 20)'
                    : null,
                borderRadius: 10,
              }}
            >
              <ListItemIcon className={classes.icon}>
                <ReceiptIcon
                  color={
                    location.pathname === '/promet/list/fakturi'
                      ? 'primary'
                      : ''
                  }
                />
              </ListItemIcon>
              <ListItemText primary='Fakturi' />
            </ListItem>
          </NavLink>

          <NavLink
            to={{ pathname: '/promet/list/priemnici' }}
            className={classes.link}
          >
            <ListItem
              button
              key={1}
              selected={location.pathname === '/promet/list/priemnici'}
              style={{
                backgroundColor:
                  location.pathname === '/promet/list/priemnici'
                    ? 'rgba(223, 242, 239, 0.7)'
                    : null,
                color:
                  location.pathname === '/promet/list/priemnici'
                    ? 'rgb(12, 19, 20)'
                    : null,
                borderRadius: 10,
              }}
            >
              <ListItemIcon className={classes.icon}>
                <ListAltIcon
                  color={
                    location.pathname === '/promet/list/priemnici'
                      ? 'primary'
                      : ''
                  }
                />
              </ListItemIcon>
              <ListItemText primary='Priemnici' />
            </ListItem>
          </NavLink>

          <NavLink
            to={{ pathname: '/promet/list/smetki' }}
            className={classes.link}
          >
            <ListItem
              button
              key={1}
              selected={location.pathname === '/promet/list/smetki'}
              style={{
                backgroundColor:
                  location.pathname === '/promet/list/smetki'
                    ? 'rgba(223, 242, 239, 0.7)'
                    : null,
                color:
                  location.pathname === '/promet/list/smetki'
                    ? 'rgb(12, 19, 20)'
                    : null,
                borderRadius: 10,
              }}
            >
              <ListItemIcon className={classes.icon}>
                <ReceiptIcon
                  color={
                    location.pathname === '/promet/list/smetki' ? 'primary' : ''
                  }
                />
              </ListItemIcon>
              <ListItemText primary='Smetki' />
            </ListItem>
          </NavLink>

          {/* <NavLink to={{ pathname: '/stavki/list' }} className={classes.link}>
            <ListItem
              button
              key={1}
              selected={location.pathname === '/stavki/list'}
              style={{
                backgroundColor:
                  location.pathname === '/stavki/list'
                    ? 'rgba(223, 242, 239, 0.7)'
                    : null,
                color:
                  location.pathname === '/stavki/list'
                    ? 'rgb(12, 19, 20)'
                    : null,
                borderRadius: 10,
              }}
            >
              <ListItemIcon className={classes.icon}>
                <FormatListNumberedIcon
                  color={location.pathname === '/stavki/list' ? 'primary' : ''}
                />
              </ListItemIcon>
              <ListItemText primary='Stavki' />
            </ListItem>
          </NavLink> */}

          <NavLink to={{ pathname: '/prikaz' }} className={classes.link}>
            <ListItem
              button
              key={1}
              selected={location.pathname === '/prikaz'}
              style={{
                backgroundColor:
                  location.pathname === '/prikaz'
                    ? 'rgba(223, 242, 239, 0.7)'
                    : null,
                color:
                  location.pathname === '/prikaz' ? 'rgb(12, 19, 20)' : null,
                borderRadius: 10,
              }}
            >
              <ListItemIcon className={classes.icon}>
                <FindInPageIcon
                  color={location.pathname === '/prikaz' ? 'primary' : ''}
                />
              </ListItemIcon>
              <ListItemText primary='Prikaz' />
            </ListItem>
          </NavLink>
        </List>
      </List>
    </Drawer>
  );
};

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.primary.main,
    opacity: 0.9,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.contrastText,
  },
  icon: {
    color: theme.palette.primary.contrastText,
  },
}));

export default Sidebar;
