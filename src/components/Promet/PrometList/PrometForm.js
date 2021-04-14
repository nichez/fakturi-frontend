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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { getRequest } from '../../../services/httpService';

import useStyles from './styles';

const PrometForm = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [promet, setPromet] = useState([]);
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    onFetchPromet();
  }, []);

  const onFetchPromet = useCallback(async () => {
    const result = await getRequest('/promet');
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

  const redirectToCreatePromet = () => {
    let path = `/promet/add`;
    history.push(path);
  };

  const editPromet = (partner) => {
    let path = `/promet/edit`;
    history.push(path, partner);
  };

  console.log('promet', promet);

  return (
    <React.Fragment>
      <div className={classes.searchContainer}>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => redirectToCreatePromet()}
        >
          Kreiraj Nova Faktura
        </Button>

        <form noValidate autoComplete='off'>
          <TextField
            id='filter-promet'
            label='Search Promet'
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
                  <Typography variant='subtitle2'>Shifra</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Broj Na Stavka</Typography>
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
                .filter(
                  (item) =>
                    item.shifra.toLowerCase().indexOf(search.toLowerCase()) !==
                    -1
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow
                    key={item.shifra}
                    className={classes.tableRow}
                    onClick={() => {}}
                  >
                    <TableCell>{item.vid}</TableCell>
                    <TableCell>{item.shifra}</TableCell>
                    <TableCell>{item.brojNaStavka}</TableCell>
                    <TableCell>{item.partner}</TableCell>
                    <TableCell>{item.datum}</TableCell>
                    <TableCell>{item.iznos}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => editPromet(item)}>
                        <EditIcon color='secondary'>edit</EditIcon>
                      </IconButton>
                      <IconButton onClick={(event) => {}}>
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
    </React.Fragment>
  );
};

export default PrometForm;
