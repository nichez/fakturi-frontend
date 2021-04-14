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
import DescriptionIcon from '@material-ui/icons/Description';
import ReceiptIcon from '@material-ui/icons/Receipt';

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
            >
              <ListItemIcon className={classes.icon}>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary='Articles' />
            </ListItem>
          </NavLink>
          <Divider variant='middle' style={{backgroundColor: location.pathname === '/article/list' ? '#ccc' : null}} />
          <NavLink to='/delovniPartneri/list' className={classes.link}>
            <ListItem
              button
              key={1}
              selected={location.pathname === '/delovniPartneri/list'}
            >
              <ListItemIcon className={classes.icon}>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary='Delovni Partneri' />
            </ListItem>
          </NavLink>
          <Divider variant='middle' style={{backgroundColor: location.pathname === '/delovniPartneri/list' ? '#ccc' : null}} />
          <NavLink to='/invoice/list' className={classes.link}>
            <ListItem
              button
              key={1}
              selected={location.pathname === '/invoice/list'}
            >
              <ListItemIcon className={classes.icon}>
                <ViewListIcon />
              </ListItemIcon>
              <ListItemText primary='Invoices' />
            </ListItem>
          </NavLink>
          <Divider variant='middle' style={{backgroundColor: location.pathname === '/invoice/list' ? '#ccc' : null}} />
          <NavLink to='/invoice/add' className={classes.link}>
            <ListItem
              button
              key={2}
              selected={location.pathname === '/invoice/add'}
            >
              <ListItemIcon className={classes.icon}>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary='Add Invoice' />
            </ListItem>
          </NavLink>
          <Divider variant='middle' style={{backgroundColor: location.pathname === '/invoice/add' ? '#ccc' : null}} />
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
