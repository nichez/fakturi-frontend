import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Card,
  Typography,
} from '@material-ui/core';

import useStyles from './styles';
import { PrikazContext } from './PrikazContext';

const formatDate = (date) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const PrikazForm = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const { prometValue, searchValue } = useContext(PrikazContext);

  const [promet, setPromet] = prometValue;
  const [search, setSearch] = searchValue;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  const onViewPromet = (promet) => {
    console.log('promet id', promet);
    let path = `/promet/details/${promet.shifra}`;
    history.push(path, promet);
  };

  return (
    <React.Fragment>
      {promet.length === 0 ? (
        <Typography variant='h6' style={{ marginTop: 30 }}>
          Ne e pronajden promet vo databazata.
        </Typography>
      ) : (
        <Card className={classes.card} elevation={6}>
          <Table
            style={{ whiteSpace: 'pre', minWidth: '750px' }}
            stickyHeader={true}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant='subtitle2'>Vid</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Broj</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Broj Na Stavki</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Partner</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Datum</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Iznos bez ddv</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Vkupno DDV</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Vkupen Iznos</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promet
                .sort((a, b) => (a.shifra < b.shifra ? 1 : -1))
                .filter(
                  (item) =>
                    item.shifra
                      .toString()
                      .toLowerCase()
                      .indexOf(search.toLowerCase()) !== -1
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow
                    key={item.shifra}
                    className={classes.tableRow}
                    onClick={() => onViewPromet(item)}
                  >
                    <TableCell>{item.vid}</TableCell>
                    <TableCell>{item.shifra.toString().slice(4)}</TableCell>
                    <TableCell>{item.rbs}</TableCell>
                    <TableCell>{item.partner}</TableCell>
                    <TableCell>{formatDate(item.datum)}</TableCell>
                    <TableCell>{item.iznosBezDdv} MKD</TableCell>
                    <TableCell>{item.vkupnoDdv} MKD</TableCell>
                    <TableCell className={classes.iznos}>
                      {item.iznos} MKD
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            className='px-16'
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={promet.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleRowsPerPage}
          />
        </Card>
      )}
    </React.Fragment>
  );
};

export default PrikazForm;
