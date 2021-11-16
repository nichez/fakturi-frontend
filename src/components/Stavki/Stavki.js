import React, { useState, useCallback, useEffect } from 'react';
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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { getRequest } from '../../services/httpService';
import useStyles from './StavkiStyles';
// import ArticleEditorDialog from './ArticleEditorDialog';
import ConfirmationDialog from '../UI/ConfirmationDialog';

const Stavki = (props) => {
  const classes = useStyles();

  const [stavki, setStavki] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarDelete, setOpenSnackbarDelete] = useState(false);
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [shouldOpenEditorDialog, setShouldOpenEditorDialog] = useState(false);
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false);
  const [currentStavka, setCurrentStavka] = useState(null);

  useEffect(() => {
    onFetchStavki();
  }, []);

  const onFetchStavki = useCallback(async () => {
    const result = await getRequest('/stavki');
    if (result.status === 200) {
      setStavki(result.data);
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

  const onCreateStavka = () => {
    setCurrentStavka(null);
    setShouldOpenEditorDialog(true);
  };

  const onEditStavka = (stavka) => {
    setCurrentStavka(stavka);
    setShouldOpenEditorDialog(true);
  };

  const onDeleteStavka = (event, stavka) => {
    event.stopPropagation();
    setCurrentStavka(stavka);
    setShouldOpenDeleteDialog(true);
  };

  const handleDialogClose = (type) => {
    if (type !== undefined) {
      setSuccessMessage(
        type === 'create'
          ? 'Stavkata e uspeshno kreirana!'
          : 'Stavkata e uspeshno promeneta!'
      );
      setOpenSnackbar(true);
      onFetchStavki();
    }
    setShouldOpenEditorDialog(false);
  };

  const handleDeleteDialogClose = (type = '') => {
    console.log('HANDLE CLOSE TYPE ', type);
    onFetchStavki();
    setShouldOpenDeleteDialog(false);
    if (type === 'error') {
      console.log('TYPE Error ', type);
      setErrorMessage('Greshka pri brishenje na stavka');
      setOpenSnackbarDelete(true);
    }
  };

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleCloseSnackbarDelete = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbarDelete(false);
  };

  return (
    <div className={classes.container}>
      <Typography variant='h5' className={classes.title}>
        Stavki
      </Typography>
      <div className={classes.searchContainer}>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => onCreateStavka()}
        >
          Kreiraj Nova Stavka
        </Button>

        <form noValidate autoComplete='off'>
          <TextField
            id='filter-stavki'
            label='Prebaruvaj Stavki'
            fullWidth
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </form>
      </div>

      {stavki.length === 0 ? (
        <Typography variant='h6' style={{ marginTop: 30 }}>
          Ne se pronajdeni stavki vo databazata.
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
                  <Typography variant='subtitle2'>Shifra</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>RBS</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Artikal (shifra)</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Kolicina</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>DDV(%)</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Cena bez DDV</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Cena so DDV</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Akcija</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stavki
                .reverse()
                .filter(
                  (item) =>
                    item.shifra
                      .toString()
                      .toLowerCase()
                      .indexOf(search.toLowerCase()) !== -1 ||
                    item.artikal
                      .toString()
                      .toLowerCase()
                      .indexOf(search.toLowerCase()) !== -1
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow
                    key={item.shifra}
                    className={classes.tableRow}
                    onClick={() => onEditStavka(item)}
                  >
                    <TableCell align='left'>{item.shifra}</TableCell>
                    <TableCell
                      align='left'
                      style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                    >
                      {item.rbs}
                    </TableCell>
                    <TableCell align='left'>{item.artikal}</TableCell>
                    <TableCell align='left'>{item.kolicina}</TableCell>
                    <TableCell>{item.ddv}%</TableCell>
                    <TableCell className='px-0' align='left'>
                      {item.vkupnaCenaBezDdv} MKD
                    </TableCell>
                    <TableCell className='px-0' align='left'>
                      {item.iznos} MKD
                    </TableCell>
                    <TableCell className='px-0 border-none'>
                      <IconButton onClick={() => onEditStavka(item)}>
                        <EditIcon color='secondary'>edit</EditIcon>
                      </IconButton>
                      <IconButton
                        onClick={(event) => onDeleteStavka(event, item)}
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
            count={stavki.length}
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
      {/* {shouldOpenEditorDialog && (
        <ArticleEditorDialog
          handleClose={handleDialogClose}
          open={shouldOpenEditorDialog}
          article={currentStavka}
        />
      )} */}
      {shouldOpenDeleteDialog && (
        <ConfirmationDialog
          open={shouldOpenDeleteDialog}
          handleClose={handleDeleteDialogClose}
          onYesClick={() => {}}
          text='Дали сигурно сакате да ја избришете ставката ?'
          item={currentStavka}
          path='stavki'
        />
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity='success'>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={openSnackbarDelete}
        autoHideDuration={3000}
        onClose={handleCloseSnackbarDelete}
      >
        <Alert onClose={handleCloseSnackbarDelete} severity='error'>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Stavki;
