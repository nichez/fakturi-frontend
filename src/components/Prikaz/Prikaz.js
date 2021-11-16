import React from 'react';

import useStyles from './styles';
import { PrikazProvider } from './PrikazContext';
import PrikazFilters from './PrikazFilters';
import PrikazForm from './PrikazForm';
import PrikazCharts from './PrikazCharts';

const Prikaz = () => {
  const classes = useStyles();

  return (
    <PrikazProvider>
      <div className={classes.container}>
        <PrikazFilters />
        <PrikazForm />
        <PrikazCharts />
      </div>
    </PrikazProvider>
  );
};

export default Prikaz;
