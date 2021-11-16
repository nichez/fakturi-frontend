import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Divider,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  DatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import useStyles from './EditPrometStyles';
import { getRequest, putRequest } from '../../../services/httpService';
import ConfirmationDialog from '../../UI/ConfirmationDialog';

const EditPromet = (props) => {
  const classes = useStyles();
  const formRef = useRef('form');
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false);
  const [stavkaToDelete, setStavkaToDelete] = useState(null);

  const [godina, setGodina] = useState(new Date());

  const [vidNaPromet, setVidNaPromet] = useState('');
  const [brojNaPromet, setBrojNaPromet] = useState('');
  const [datum, setDatum] = useState(new Date());
  const [sitePartneri, setSitePartneri] = useState([]);
  const [artikli, setArtikli] = useState([]);
  const [partner, setPartner] = useState('');
  const [stavki, setStavki] = useState([]);

  useEffect(() => {
    getFakturaByShifra(props.match.params.id);
    onFetchArtikli();
    onFetchSitePartneri();
  }, []);

  const getFakturaByShifra = useCallback(async (shifra) => {
    const result = await getRequest(`/promet/${shifra}`);
    if (result.status === 200 || result.status === 201) {
      setBrojNaPromet(Number(result.data.shifra.toString().slice(4)));
      setVidNaPromet(result.data.vid);
      setDatum(result.data.datum);
      onFetchPartner(result.data.partner);
      onFetchStavki(result.data.shifra);
    }
  }, []);

  const onFetchSitePartneri = useCallback(async () => {
    const result = await getRequest('/delovniPartneri');
    if (result.status === 200 || result.status === 201) {
      setSitePartneri(result.data);
    }
  }, []);

  const onFetchArtikli = useCallback(async () => {
    const result = await getRequest('/articles');
    if (result.status === 200 || result.status === 201) {
      setArtikli(result.data);
    }
  }, []);

  const onFetchPromet = useCallback(async (shifra) => {
    const result = await getRequest('/promet/', shifra);
    if (result.status === 200 || result.status === 201) {
      if (typeof result.data === 'object') {
        history.push(`/promet/${shifra}`);
        getFakturaByShifra(shifra);
      } else if (result.data.length === 0) {
        history.push(`/promet/add`);
      }
    }
  }, []);

  const fetchPromet = (event) => {
    onFetchPromet(event.target.value);
  };

  const fetchPrometOnEnter = (event) => {
    if (event.key === 'Enter') {
      onFetchPromet(event.target.value);
    }
  };

  const onFetchPartner = useCallback(async (shifra) => {
    const result = await getRequest('/delovniPartneri/', shifra);
    if (result.status === 200 || result.status === 201) {
      setPartner(result.data);
    }
  }, []);

  const onFetchStavki = useCallback(async (broj) => {
    const result = await getRequest(`/stavki/byBroj/${broj}`);
    let transformDataToArray = [];
    if (result.status === 200 || result.status === 201) {
      result.data.map((item) => {
        item.datum = formatDate(item.datum);
        transformDataToArray.push(Object.keys(item).map((k) => item[k]));
        return item;
      });
      setStavki(transformDataToArray);
    }
  }, []);

  const onPartnerChange = (event, partner) => {
    setPartner(partner);
  };

  const redirectToFakturi = () => {
    let path = '/promet/list/fakturi';
    history.push(path);
  };

  const handleVidNaPromet = (event) => {
    setVidNaPromet(event.target.value);
  };

  const onArtikalChange = (event, values, index) => {
    let newStavkiList = [...stavki];
    newStavkiList.map((element, i) => {
      if (!values && index === i) {
        element[0] = ''; // shifra
        element[1] = i + 1; // rbs
        element[2] = ''; // artikal
        element[3] = 1; // kolicina
        element[4] = 0; // cena
        element[5] = 0; // iznos
        element[6] = vidNaPromet; // vid
        element[7] = 0; // ddv
        element[8] = 0; // presmetanDdv
        element[9] = 0; // vkupnaCenaBezDdv
        element[12] = formatDate(datum); // datum
      }

      if (values && index === i) {
        element[0] = ''; // shifra
        element[1] = i + 1; // rbs
        element[2] = values; // artikal
        element[3] = 1; // kolicina
        element[4] = values.cena; // cena
        element[5] =
          values.cena + (values.tarifen_broj_ddv / 100) * values.cena; // iznos
        element[6] = vidNaPromet; // vid
        element[7] = values.tarifen_broj_ddv; // ddv
        element[8] = (values.tarifen_broj_ddv / 100) * values.cena; // presmetanDdv
        element[9] = values.cena; // vkupnaCenaBezDdv
        element[12] = formatDate(datum); // datum
      }
      return element;
    });
    console.log('newStavkiList', newStavkiList);
    setStavki(newStavkiList);
  };

  const presmetajKolicina = (event, index) => {
    let newStavkiList = [...stavki];
    newStavkiList.map((element, i) => {
      if (index === i) {
        element[3] = +event.target.value; // kolicina
        element[9] = element[4] * element[3]; // vkupnaCenaBezDdv
        element[8] = (element[7] / 100) * element[9]; // presmetanDdv
        element[5] = element[9] + (element[7] / 100) * element[9]; // iznos
      }
      return element;
    });
    setStavki(newStavkiList);
  };

  const onNetoCenaChange = (event, index) => {
    let newStavkiList = [...stavki];
    newStavkiList.map((element, i) => {
      if (index === i) {
        element[4] = +event.target.value; // cena
        element[9] = element[4] * element[3]; // vkupnaCenaBezDdv
        element[8] = (element[7] / 100) * element[9]; // presmetanDdv
        element[5] = element[9] + (element[7] / 100) * element[9]; // iznos
      }
      return element;
    });
    setStavki(newStavkiList);
  };

  const addStavkaToPromet = () => {
    const newStavka = [
      '', //shifra
      stavki.length, // rbs
      '', // artikal
      '', // kolicina
      '', // cena
      '', // iznos
      vidNaPromet, // vid
      '', // ddv
      '', // presmetanDdv
      '', // vkupnaCenaBezDdv
      +`${godina.getFullYear()}${brojNaPromet}`, // brojNaPromet / brojNaPromet
      partner.shifra, // partner
      formatDate(datum), // datum
    ];
    setStavki([...stavki, newStavka]);
  };

  const deleteStavkaFromPromet = (event, stavka) => {
    event.stopPropagation();
    const itemToDelete = {
      shifra: stavka[0],
    };
    setStavkaToDelete(itemToDelete);
    setShouldOpenDeleteDialog(true);
  };

  const SetTotalWithoutDdv = () => {
    let total = 0;
    stavki.map((item) => {
      total += +item[9];
      return item;
    });
    return (
      <p className={classes.totalCostLabels}>{total ? total.toFixed(2) : 0}</p>
    );
  };

  const SetTotalDdv = () => {
    let total = 0;
    stavki.map((item) => {
      total += +item[8];
      return item;
    });
    return (
      <p className={classes.totalCostLabels}>{total ? total.toFixed(2) : 0}</p>
    );
  };

  const SetTotalWithDdv = () => {
    let total = 0;
    stavki.map((item) => {
      total += +item[5];
      return item;
    });
    return (
      <p className={classes.totalCostLabels}>
        <strong>{total ? total.toFixed(2) : 0}</strong>
      </p>
    );
  };

  const formatDate = (date) => {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
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

  const onUpdateStavki = async (path, body) => {
    const [stavkiToEdit, prometToEdit] = body;
    stavkiToEdit.map((item) => {
      item[2] = item[2].shifra;
      return item;
    });
    const result = await putRequest(path, [stavkiToEdit, prometToEdit]);
    if (result.status === 200 || result.status === 201) {
      setOpenSnackbar(true);
      setSuccessMessage('Prometot e uspeshno promenet!');
      setTimeout(() => {
        setLoading(false);
        redirectToFakturi();
      }, 2000);
    } else {
      setLoading(false);
      setOpenSnackbar(true);
      setSuccessMessage('Greshka pri promena na prometot.');
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    if (!(partner && datum && brojNaPromet)) {
      setLoading(false);
      return;
    }

    let vkupenIznos = 0;
    stavki.map((item) => {
      vkupenIznos += item[5];
      return item;
    });

    const prometToSave = `${godina.getFullYear()}${brojNaPromet}`;

    let editPromet = {
      shifra: +prometToSave,
      partner: partner.shifra,
      datum: formatDate(datum),
      iznos: vkupenIznos,
      vid: vidNaPromet,
      rbs: stavki.length,
      godina: godina.getFullYear()
    };

    console.log('SUBMIT FPRM stavki', stavki);
    console.log('SUBMIT FPRM editPromet', editPromet);

    onUpdateStavki('/stavki', [stavki, editPromet]);
  };

  const handleDeleteDialogClose = () => {
    onFetchStavki(+`${godina.getFullYear()}${brojNaPromet}`);
    setShouldOpenDeleteDialog(false);
  };

  return (
    <Card elevation={6} className={classes.content}>
      <ValidatorForm
        ref={formRef}
        onSubmit={handleSubmit}
        onError={(errors) => handleSubmit()}
      >
        <div className={classes.topRow}>
          <FormControl className={classes.formControl}>
            <Select
              value={vidNaPromet}
              onChange={handleVidNaPromet}
              displayEmpty
              className={classes.selectEmpty}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value={'FK'}>Faktura</MenuItem>
              <MenuItem value={'PR'}>Priemnica</MenuItem>
              <MenuItem value={'SM'}>SM</MenuItem>
            </Select>
            <FormHelperText>Vid na promet</FormHelperText>
          </FormControl>

          <div className={classes.rightButttons}>
            {loading ? (
              <div className={classes.spinner}>
                <CircularProgress color='secondary' />
              </div>
            ) : (
              <div>
                <Button
                  type='button'
                  className={classes.cancelButton}
                  variant='text'
                  onClick={redirectToFakturi}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='py-8'
                  variant='contained'
                  color='primary'
                  disabled={
                    loading ||
                    !partner ||
                    !brojNaPromet ||
                    (stavki.length < 1 && stavki[0] !== '')
                  }
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className={classes.fakturaInfo}>
          <div>
            <h4>Faktura</h4>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                className={classes.datePicker}
                views={['year']}
                label='Godina'
                value={godina}
                onChange={(date) => setGodina(date)}
              />
            </MuiPickersUtilsProvider>
            <TextValidator
              label='Broj na faktura'
              onChange={(event) => setBrojNaPromet(event.target.value)}
              type='text'
              fullWidth
              name='brojNaPromet'
              value={brojNaPromet}
              validators={['required']}
              errorMessages={['Poleto e zadolzhitelno']}
              onBlur={fetchPromet}
              onKeyPress={fetchPrometOnEnter}
            />

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                className={classes.datePicker}
                margin='none'
                id='datum'
                label='Datum'
                inputVariant='standard'
                type='text'
                autoOk={true}
                value={datum}
                fullWidth
                format='MMMM dd, yyyy'
                onChange={(date) => setDatum(date)}
                disabled
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <div className={classes.textAlignRight}>
            <h4>Info za partner</h4>
            <Autocomplete
              id='najdiPartner'
              options={sitePartneri}
              getOptionLabel={(option) => (option.ime ? option.ime : '')}
              style={{ minWidth: 210 }}
              onChange={(event, values) => onPartnerChange(event, values)}
              value={partner}
              renderInput={(params) => (
                <TextField {...params} label='Izberi Partner' margin='normal' />
              )}
            />
          </div>
        </div>

        <Divider className={classes.divider} />

        {partner && (
          <Grid container justify='space-between' spacing={4}>
            <Grid item>
              <div>
                <h4>Info za partnerot</h4>
                <TextValidator
                  className={classes.inputField}
                  label='Danocen broj'
                  type='text'
                  name='danocenBroj'
                  fullWidth
                  value={partner.edb}
                  validators={['required']}
                  errorMessages={['Poleto e zadolzhitelno']}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextValidator
                  className={classes.inputField}
                  label='Telefonski broj'
                  type='text'
                  name='telefonskiBroj'
                  fullWidth
                  multiline={true}
                  rowsMax={4}
                  value={partner.telefonski_broj}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
            </Grid>
            <Grid item>
              <div className={classes.textAlignRight}>
                <h4>Deloven Partner</h4>
                <TextValidator
                  className={classes.inputField}
                  label='Ime na klientot'
                  type='text'
                  name='imeNaKlientot'
                  fullWidth
                  multiline={true}
                  rowsMax={4}
                  value={partner.ime}
                  validators={['required']}
                  errorMessages={['Poleto e zadolzhitelno']}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextValidator
                  className={classes.inputField}
                  label='Adresa na klientot'
                  type='text'
                  name='adresaNaKlientot'
                  fullWidth
                  multiline={true}
                  rowsMax={4}
                  value={partner?.adresa}
                  validators={['required']}
                  errorMessages={['Poleto e zadolzhitelno']}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
            </Grid>
          </Grid>
        )}

        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableRow}>
              <TableCell className='pl-sm-24'>#</TableCell>
              <TableCell className='px-0'>Artikal</TableCell>
              <TableCell className='px-0'>Kolicina</TableCell>
              <TableCell className='px-0'>Neto Cena</TableCell>
              <TableCell className='px-0'>Tarifa DDV(%)</TableCell>
              <TableCell className='px-0'>Presmetan DDV</TableCell>
              <TableCell className='px-0'>Vrednost so DDV</TableCell>
              <TableCell className='px-0'>Akcija</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stavki.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <TextValidator
                      label='RBS'
                      type='number'
                      name='rbs'
                      value={index + 1}
                      disabled
                    />
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    <Autocomplete
                      id='imeNaArtikal'
                      options={artikli}
                      getOptionLabel={(option) =>
                        option.ime ? option.ime : ''
                      }
                      style={{ minWidth: 210 }}
                      onChange={(event, values) =>
                        onArtikalChange(event, values, index)
                      }
                      value={item[2]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Ime na Artikal'
                          margin='normal'
                          multiline
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    <TextValidator
                      label='Kolicina'
                      onChange={(event) => presmetajKolicina(event, index)}
                      type='number'
                      name='kolicina'
                      value={item ? item[3] : null}
                      validators={['required']}
                      errorMessages={['poleto e zadolzhitelno']}
                      disabled={!item[2]}
                    />
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    <TextValidator
                      onChange={(event) => onNetoCenaChange(event, index)}
                      type='number'
                      label='Neto Cena'
                      name='cena'
                      value={item ? item[4] : null}
                      validators={['required']}
                      errorMessages={['poleto e zadolzhitelno']}
                    />
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    {item[7] ? item[7] : ''}%
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    {item[8] ? item[8].toFixed(2) : ''}
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    {item[5] ? item[5].toFixed(2) : ''}
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    <Button
                      onClick={(event) => deleteStavkaFromPromet(event, item)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className={classes.addItemButton}>
          <Button onClick={addStavkaToPromet}>Dodadi Artikal</Button>
        </div>

        {/* total cost calculation */}
        <div className={classes.totalCostContainer}>
          <div className={classes.totalCost}>
            <div className={classes.totalCostLabelsContainer}>
              <p className={classes.totalCostLabels}>Vkupen iznos bez DDV:</p>
              <p className={classes.totalCostLabels}>Presmetan DDV:</p>
              <strong className={classes.totalCostLabels}>
                <p>Vkupno:</p>
              </strong>
            </div>
            <div>
              <SetTotalWithoutDdv />
              <SetTotalDdv />
              <SetTotalWithDdv />
            </div>
          </div>
        </div>
      </ValidatorForm>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={
            successMessage === 'Greshka pri kreiranje na faktura.'
              ? 'danger'
              : 'success'
          }
        >
          {successMessage}
        </Alert>
      </Snackbar>
      {shouldOpenDeleteDialog && (
        <ConfirmationDialog
          open={shouldOpenDeleteDialog}
          handleClose={handleDeleteDialogClose}
          onYesClick={() => {}}
          text='Дали сигурно сакате да го избришете ставката ?'
          item={stavkaToDelete}
          path='stavki'
        />
      )}
    </Card>
  );
};

export default EditPromet;
