import React from 'react';
import { Typography } from '@material-ui/core';

import useStyles from './styles';
import DelovniPartneriForm from './DelovniPartneriForm';

const DelovniPartneriList = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant='h5' className={classes.title}>
        Delovni Partneri
      </Typography>
      <DelovniPartneriForm />
    </div>
  );
};

export default DelovniPartneriList;
