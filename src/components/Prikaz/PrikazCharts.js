import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  PieSeries,
  Title,
  Legend,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { Stack, Animation, EventTracker } from '@devexpress/dx-react-chart';

import useStyles from './styles';
import { PrikazContext } from './PrikazContext';

const legendStyles = () => ({
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
  },
});

const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
);

const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);

const legendLabelStyles = () => ({
  label: {
    whiteSpace: 'nowrap',
  },
});

const legendLabelBase = ({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
);

const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(
  legendLabelBase
);

const PrikazCharts = () => {
  const classes = useStyles();

  const { prometValue, searchValue } = useContext(PrikazContext);

  const [promet] = prometValue;
  const [search] = searchValue;

  const upsert = (array, item) => {
    const i = array.findIndex((_item) => _item.godina === item.godina);
    console.log('i ', i);
    if (i > -1) array[i].iznos += item.iznos;
    else array.push(item);
  };

  let pieData = [];

  console.log('promet ', promet);
  promet
    .filter(
      (item) =>
        item.shifra.toString().toLowerCase().indexOf(search.toLowerCase()) !==
        -1
    )
    .map((item) => {
      item.godina = item.godina.toString();
      upsert(pieData, { godina: item.godina, iznos: item.iznos });
      return item;
    });

  console.log('pieData ', pieData);

  return (
    promet.length > 0 && (
      <div className={classes.chartContainer}>
        <Paper className={classes.barChart}>
          <Chart
            data={promet
              .filter(
                (item) =>
                  item.shifra
                    .toString()
                    .toLowerCase()
                    .indexOf(search.toLowerCase()) !== -1
              )
              .map((item) => {
                // item.godina = item.godina.toString();
                return item;
              })}
          >
            <ArgumentAxis />
            <ValueAxis />

            <BarSeries
              name='Ddv'
              valueField='vkupnoDdv'
              argumentField='godina'
              color='#ffd700'
            />
            <BarSeries
              name='Iznos bez ddv'
              valueField='iznosBezDdv'
              argumentField='godina'
              color='#c0c0c0'
            />
            <BarSeries
              name='Vkupen iznos'
              valueField='iznos'
              argumentField='godina'
              color='#cd7f32'
            />
            <Animation />
            <Legend
              position='bottom'
              rootComponent={Root}
              labelComponent={Label}
            />
            <Title text='Promet po godina' />
            <EventTracker />
            <Tooltip />
            <Stack />
          </Chart>
        </Paper>

        <Paper className={classes.pieChart}>
          <Chart data={pieData}>
            <PieSeries name='vid' valueField='iznos' argumentField='godina' />
            <Title text='Vkupen iznos po godina' />
            <Animation />
            <Legend
              position='bottom'
              rootComponent={Root}
              labelComponent={Label}
            />
            <EventTracker />
            <Tooltip />
          </Chart>
        </Paper>
      </div>
    )
  );
};

export default PrikazCharts;
