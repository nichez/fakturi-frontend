import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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

import useStyles from './AddPrometStyles';
import { getRequest, postRequest } from '../../../services/httpService';

const AddPromet = (props) => {
  const classes = useStyles();
  const formRef = useRef('form');
  const history = useHistory();
  const location = useLocation();

  const [godina, setGodina] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [vidNaPromet, setVidNaPromet] = useState(location.state.vid || 'FK');
  const [brojNaPromet, setBrojNaPromet] = useState('');
  const [datum, setDatum] = useState(new Date());
  const [sitePartneri, setSitePartneri] = useState([]);
  const [artikli, setArtikli] = useState([]);
  const [partner, setPartner] = useState('');
  const [stavki, setStavki] = useState([]);

  useEffect(() => {
    onFetchLastPrometBroj();
    onFetchArtikli();
    onFetchSitePartneri();
  }, []);

  const onFetchLastPrometBroj = useCallback(async () => {
    const result = await getRequest('/promet/all/last');
    if (
      result.status === 200 ||
      result.status === 201 ||
      result.status === 204
    ) {
      console.log('result last broj ', result.data['MAX(shifra)']);
      console.log(`${godina.getFullYear()}${result.data['MAX(shifra)']}`);
      const lastPromet = result.data['MAX(shifra)']
        ? result.data['MAX(shifra)'].toString()
        : '0';
      const lastPrometResult = Number(lastPromet.slice(4));
      setBrojNaPromet(lastPrometResult + 1);
    }
  }, []);

  const onFetchSitePartneri = useCallback(async () => {
    const result = await getRequest('/delovniPartneri');
    if (result.status === 200) {
      setSitePartneri(result.data);
    }
  }, []);

  const onFetchArtikli = useCallback(async () => {
    const result = await getRequest('/articles');
    if (result.status === 200) {
      setArtikli(result.data);
    }
  }, []);

  const onFetchPromet = useCallback(async (shifra) => {
    const result = await getRequest('/promet/', shifra);
    if (result.statusText === 'OK') {
      console.log('onFetchPromet ', result.data, '=== ', shifra);
      if (result.data.shifra === +shifra) {
        history.push(`/promet/${shifra}`);
      }
    }
  }, []);

  const fetchPromet = (event) => {
    console.log('fetchPromet', event.target.value);
    onFetchPromet(`${godina.getFullYear()}${event.target.value}`);
  };

  const fetchPrometOnEnter = (event) => {
    if (event.key === 'Enter') {
      onFetchPromet(`${godina.getFullYear()}${event.target.value}`);
    }
  };

  const onPartnerChange = (event, partner) => {
    console.log('partner', partner);
    setPartner(partner);
  };

  const handleVidNaPromet = (event) => {
    console.log('event', event.target.value);
    setVidNaPromet(event.target.value);
  };

  const onArtikalChange = (event, values, index) => {
    console.log('event', event.target.value);
    console.log('values', values);
    console.log('index', index);
    let newStavkiList = [...stavki];
    newStavkiList.map((element, i) => {
      console.log('nov element ', element, i, index);
      if (!values && index === i) {
        element[0] = i + 1; // rbs
        element[1] = ''; // artikal
        element[2] = 1; // kolicina
        element[3] = 0; // cena
        element[4] = 0; // iznos
        element[5] = vidNaPromet; // vid
        element[6] = 0; // ddv
        element[7] = 0; // presmetanDdv
        element[8] = 0; // vkupnaCenaBezDdv
      }

      if (values && index === i) {
        console.log('postoecki ', values, index, i);
        console.log(
          'postoecki res ',
          values.cena + (values.tarifen_broj_ddv / 100) * values.cena
        );

        element[0] = i + 1; // rbs
        element[1] = values.shifra; // artikal
        element[2] = 1; // kolicina
        element[3] = values.cena; // cena
        element[4] =
          values.cena + (values.tarifen_broj_ddv / 100) * values.cena; // iznos
        element[5] = vidNaPromet; // vid
        element[6] = values.tarifen_broj_ddv; // ddv
        element[7] = (values.tarifen_broj_ddv / 100) * values.cena; // presmetanDdv
        element[8] = values.cena; // vkupnaCenaBezDdv
      }
      return element;
    });
    console.log('newStavkiList', newStavkiList);
    setStavki(newStavkiList);
  };

  const presmetajKolicina = (event, index) => {
    let newStavkiList = [...stavki];
    console.log('presmetajKolicina ', event.target.value, ' ', index);
    newStavkiList.map((element, i) => {
      if (index === i) {
        element[2] = +event.target.value; // kolicina
        element[8] = element[3] * element[2]; // vkupnaCenaBezDdv
        element[7] = (element[6] / 100) * element[8]; // presmetanDdv
        element[4] = element[8] + (element[6] / 100) * element[8]; // iznos
      }
      console.log('ELEEEEMEEEEnT ', element, ' ', i);
      return element;
    });
    setStavki(newStavkiList);
  };

  const onNetoCenaChange = (event, index) => {
    let newStavkiList = [...stavki];
    newStavkiList.map((element, i) => {
      if (index === i) {
        element[3] = +event.target.value; // cena
        element[8] = element[3] * element[2]; // vkupnaCenaBezDdv
        element[7] = (element[6] / 100) * element[8]; // presmetanDdv
        element[4] = element[8] + (element[6] / 100) * element[8]; // iznos
      }
      return element;
    });
    setStavki(newStavkiList);
  };

  const addStavkaToPromet = () => {
    const newStavka = [
      stavki.length, // rbs
      '', // artikal
      '', // kolicina
      '', // cena
      '', // iznos
      vidNaPromet, // vid
      '', // ddv
      '', // presmetanDdv
      '', // vkupnaCenaBezDdv
      +`${godina.getFullYear()}${brojNaPromet}`, // brojNaPromet / brojNaFaktura
      partner.shifra, // partner
      formatDate(datum),
    ];
    setStavki([...stavki, newStavka]);
  };

  const deleteStavkaFromPromet = (index) => {
    let newStavkiList = [...stavki];
    newStavkiList.splice(index, 1);
    setStavki(newStavkiList);
  };

  const SetTotalWithoutDdv = () => {
    let total = 0;
    stavki.map((item) => {
      total += +item[8];
      return item;
    });
    return (
      <p className={classes.totalCostLabels}>{total ? total.toFixed(2) : 0}</p>
    );
  };

  const SetTotalDdv = () => {
    let total = 0;
    stavki.map((item) => {
      console.log('SetTotalDdv ', item);
      total += +item[7];
      return item;
    });
    return (
      <p className={classes.totalCostLabels}>{total ? total.toFixed(2) : 0}</p>
    );
  };

  const SetTotalWithDdv = () => {
    let total = 0;
    stavki.map((item) => {
      total += +item[4];
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

  const onCreateStavki = async (path, body) => {
    console.log('onCreateStavki path', path);
    console.log('onCreateStavki body', body);
    console.log('onCreateStavki partner ', partner);
    console.log('onCreateStavki artikal ', brojNaPromet);

    const result = await postRequest(path, body);
    if (result.status === 200 || result.status === 201) {
      setOpenSnackbar(true);
      setSuccessMessage('Fakturata e uspeshno kreirana!');
      setTimeout(() => {
        setLoading(false);
        redirectToFakturi();
      }, 1500);
    } else {
      setLoading(false);
      setOpenSnackbar(true);
      setSuccessMessage('Greshka pri kreiranje na faktura.');
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
      vkupenIznos += item[4];
      return item;
    });

    let iznosBezDdv = 0;
    stavki.map((item) => {
      iznosBezDdv += +item[8];
      return item;
    });

    let vkupnoDdv = 0;
    stavki.map((item) => {
      vkupnoDdv += +item[7];
      return item;
    });

    console.log('vkupenIznos ', vkupenIznos);

    const prometToSave = `${godina.getFullYear()}${brojNaPromet}`;
    console.log('prometToSave ', +prometToSave);

    let novPromet = {
      shifra: +prometToSave,
      datum: formatDate(datum),
      iznos: vkupenIznos,
      vid: vidNaPromet,
      partner: partner.shifra,
      rbs: stavki.length,
      godina: godina.getFullYear(),
      iznosBezDdv: iznosBezDdv,
      vkupnoDdv: vkupnoDdv,
    };

    console.log('submit stavki ', stavki);
    console.log('submit novPromet ', novPromet);
    console.log('submit godina ', godina.getFullYear());

    onCreateStavki('/stavki', [stavki, novPromet]);
  };

  const redirectToFakturi = () => {
    const path = '/promet/list/fakturi';
    history.push(path);
  };

  console.log('stavki NEW ', stavki);

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
              <MenuItem value={'SM'}>Smetka</MenuItem>
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
              onChange={(event) => setBrojNaPromet(+event.target.value)}
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
                disabled={stavki.length}
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
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Ime na Artikal'
                          margin='normal'
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
                      value={item ? item[2] : null}
                      validators={['required']}
                      errorMessages={['poleto e zadolzhitelno']}
                      disabled={!item[1]}
                    />
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    <TextValidator
                      onChange={(event) => onNetoCenaChange(event, index)}
                      type='number'
                      label='Neto Cena'
                      name='cena'
                      value={item ? item[3] : null}
                      validators={['required']}
                      errorMessages={['poleto e zadolzhitelno']}
                    />
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    {item[6] ? item[6] : ''}%
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    {item[7] ? item[7].toFixed(2) : ''}
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    {item[4] ? item[4].toFixed(2) : ''}
                  </TableCell>

                  <TableCell className='pl-0 capitalize' align='left'>
                    <Button onClick={() => deleteStavkaFromPromet(index)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className={classes.addItemButton}>
          <Button
            onClick={addStavkaToPromet}
            disabled={!brojNaPromet || !partner}
          >
            Dodadi Artikal
          </Button>
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
    </Card>
  );
};

export default AddPromet;
