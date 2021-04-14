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

const DelovniPartneriForm = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    onFetchPartners();
  }, []);

  const onFetchPartners = useCallback(async () => {
    const result = await getRequest('/delovniPartneri');
    if (result.status === 200) {
      setPartners(result.data);
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

  const redirectToCreatePartner = () => {
    let path = `/delovniPartneri/create`;
    history.push(path);
  };

  const editPartner = (partner) => {
    let path = `/delovniPartneri/create`;
    history.push(path, partner);
  };

  console.log('partners', partners);

  return (
    <React.Fragment>
      <div className={classes.searchContainer}>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => redirectToCreatePartner()}
        >
          Kreiraj Nov Partner
        </Button>

        <form noValidate autoComplete='off'>
          <TextField
            id='filter-partners'
            label='Search Partners'
            fullWidth
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </form>
      </div>
      {partners.length === 0 ? (
        <Typography variant='h6' style={{ marginTop: 30 }}>
          Ne se pronajdeni delovni partneri vo databazata.
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
                  <Typography variant='subtitle2'>Ime</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Telefonski Broj</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Adresa</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Banka Deponent</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>EDB</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Korekcija</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partners
                .filter(
                  (partner) =>
                    partner.shifra
                      .toLowerCase()
                      .indexOf(search.toLowerCase()) !== -1 ||
                    partner.ime.toLowerCase().indexOf(search.toLowerCase()) !==
                      -1
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((partner, index) => (
                  <TableRow
                    key={partner.shifra}
                    className={classes.tableRow}
                    onClick={() => {}}
                  >
                    <TableCell>{partner.shifra}</TableCell>
                    <TableCell
                      align='left'
                      style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                    >
                      {partner.ime}
                    </TableCell>
                    <TableCell>{partner.telefonski_broj}</TableCell>
                    <TableCell>{partner.adresa}</TableCell>
                    <TableCell>{partner.banka_deponent}</TableCell>
                    <TableCell>{partner.edb}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => editPartner(partner)}>
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
            count={partners.length}
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

export default DelovniPartneriForm;
