import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  Card,
  Typography,
  TextField,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { getRequest } from '../../../services/httpService';
import ConfirmationDialog from '../../UI/ConfirmationDialog';

import useStyles from './styles';

const formatDate = (date) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const PrometForm = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false);
  const [currentPromet, setCurrentPromet] = useState(null);

  const [promet, setPromet] = useState([]);
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const [godina, setGodina] = useState(new Date());

  useEffect(() => {
    onFetchPromet(props.vid, godina.getFullYear());
  }, [props.vid]);

  const onFetchPromet = useCallback(async (vid, god) => {
    let path = vid === 'none' ? `/promet` : `/promet/byGodina/'${vid}'/${god}`;

    const result = await getRequest(path);
    console.log('onFetchPromet res ', result);
    if (result.status === 200) {
      setPromet(result.data);
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  const onDeletePromet = (event, promet) => {
    event.stopPropagation();
    promet.ime = promet.shifra;
    setCurrentPromet(promet);
    setShouldOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    onFetchPromet(props.vid, godina.getFullYear());
    setShouldOpenDeleteDialog(false);
  };

  const redirectToCreatePromet = () => {
    let path = `/promet/add`;
    history.push(path, { vid: props.vid });
  };

  const editPromet = (event, promet) => {
    event.stopPropagation();
    console.log('promet id', promet);
    let path = `/promet/${promet.shifra}`;
    history.push(path, promet);
  };

  const onViewPromet = (promet) => {
    console.log('promet id', promet);
    let path = `/promet/details/${promet.shifra}`;
    history.push(path, promet);
  };

  const onChangeGodina = (date) => {
    setGodina(date);
    onFetchPromet(props.vid, date.getFullYear());
  }

  const ButtonLabel = () => {
    if (props.vid === 'FK') return <>Faktura</>;
    if (props.vid === 'PR') return <>Priemnica</>;
    if (props.vid === 'SM') return <>Smetka</>;

    return <></>;
  };

  return (
    <React.Fragment>
      <div className={classes.searchContainer}>
        <div className={classes.leftSide}>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => redirectToCreatePromet()}
            className={classes.createBtn}
          >
            Kreiraj Nova <ButtonLabel />
          </Button>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              className={classes.godinaPicker}
              views={['year']}
              label='Godina'
              value={godina}
              onChange={(date) => onChangeGodina(date)}
            />
          </MuiPickersUtilsProvider>
          <Button
            color='primary'
            onClick={() => onFetchPromet('none')}
            style={{marginLeft: 10}}
          >
            Site
          </Button>
        </div>

        <form noValidate autoComplete='off'>
          <TextField
            id='filter-promet'
            label='Prebaruvaj Promet'
            fullWidth
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </form>
      </div>
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
                  <Typography variant='subtitle2'>Iznos</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Korekcija</Typography>
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
                    <TableCell>{item.iznos}</TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => editPromet(event, item)}>
                        <EditIcon color='secondary'>edit</EditIcon>
                      </IconButton>
                      <IconButton
                        onClick={(event) => onDeletePromet(event, item)}
                      >
                        <DeleteIcon color='error'>delete</DeleteIcon>
                      </IconButton>
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
      {shouldOpenDeleteDialog && (
        <ConfirmationDialog
          open={shouldOpenDeleteDialog}
          handleClose={handleDeleteDialogClose}
          onYesClick={() => {}}
          text='Дали сигурно сакате да го избришете прометот ?'
          item={currentPromet}
          path='promet'
        />
      )}
    </React.Fragment>
  );
};

export default PrometForm;
