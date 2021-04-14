import React from 'react';
import { Typography } from '@material-ui/core';

import useStyles from './styles';
import PrometForm from './PrometForm';

const PrometList = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant='h5' className={classes.title}>
        Promet
      </Typography>
      <PrometForm />
    </div>
  );
};

export default PrometList;
