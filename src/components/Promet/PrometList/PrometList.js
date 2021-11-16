import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from '@material-ui/core';

import useStyles from './styles';
import PrometForm from './PrometForm';

const PrometList = (props) => {
  const classes = useStyles();
  const location = useLocation();

  const [vid, setVid] = useState('none');

  useEffect(() => {
    getLastPath(location.pathname);
  }, [location.pathname]);

  const getLastPath = useCallback((path) => {
    const pathname = path.substring(path.lastIndexOf('/') + 1);
    console.log('pathname', pathname);
    if (pathname === 'fakturi') {
      setVid('FK');
    }
    if (pathname === 'priemnici') {
      setVid('PR');
    }
    if (pathname === 'smetki') {
      setVid('SM');
    }
  }, []);

  const VidLabel = () => {
    const pathname =
      location.pathname.substring(location.pathname.lastIndexOf('/') + 1) ===
      'list'
        ? 'Promet'
        : location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    return (
      <Typography variant='h5' className={classes.title}>
        {pathname.charAt(0).toUpperCase() + pathname.slice(1)}
      </Typography>
    );
  };

  return (
    <div className={classes.container}>
      <VidLabel />
      <PrometForm vid={vid} />
    </div>
  );
};

export default PrometList;
