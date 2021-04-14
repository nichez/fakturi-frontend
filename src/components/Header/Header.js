import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

const Header = (props) => {
  const classes = useStyles();
  const [language, setLanguage] = useState('mk');
  const { t, i18n } = useTranslation();

  const { openSidebar, open } = props;

  const onLanguageSelect = (lang) => {
    console.log('lang select ', lang)
    setLanguage(lang);
    i18n.changeLanguage(lang);
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
          <Typography variant='h6' noWrap className={classes.textColor}>
            Invoice Management Application
          </Typography>
        </div>
        {/* <div>
          <FormControl className={classes.formControl}>
            <Select
              labelId='Language'
              id='language-picker'
              value={language}
              // onChange={() => {}}
            >
              <MenuItem value={'mk'} onClick={() => onLanguageSelect('mk')}>
                <Avatar
                  style={{ width: 25, height: 15 }}
                  variant='square'
                  alt='Macedonia'
                  src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_North_Macedonia.svg/1280px-Flag_of_North_Macedonia.svg.png'
                />
              </MenuItem>
              <MenuItem value={'en'} onClick={() => onLanguageSelect('en')}>
                <Avatar
                  style={{ width: 25, height: 15 }}
                  variant='square'
                  alt='English'
                  src='https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg'
                />
              </MenuItem>
            </Select>
          </FormControl>
        </div> */}
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
}));

export default Header;
