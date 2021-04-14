import React, { useState, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Radio,
  FormControl,
  FormControlLabel,
  Divider,
  RadioGroup,
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
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { set } from 'date-fns';

import useStyles from '../InvoiceStyles';
import {
  getRequest,
  postRequest,
  putRequest,
} from '../../../services/httpService';

const InvoiceEditor = (props) => {
  const classes = useStyles();
  const formRef = useRef('form');

  const [brojNaFaktura, setBrojNaFaktura] = useState('');
  const [ddv, setDdv] = useState('');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [stavki, setStavki] = useState([]);
  const [broj, setBroj] = useState();
  const [articles, setArticles] = useState([]);
  const [partneri, setPartneri] = useState([]);
  const [izbranPartner, setIzbranPartner] = useState();
  const [izbranPromet, setIzbranPromet] = useState();

  let subTotalCost = 0;

  useEffect(() => {
    onFetchArticles();
    onFetchPartners();
  }, []);

  const onFetchPartner = useCallback(async (shifra) => {
    console.log('PARTNER SHIFRA', shifra);
    const result = await getRequest('/delovniPartneri/', shifra);
    console.log('onFetchPartner result', result);
    if (result.status === 200) {
      setIzbranPartner(result.data[0]);
    }
  }, []);

  const onFetchSinglePromet = useCallback(async (shifra) => {
    const result = await getRequest('/promet/', shifra);
    if (result.status === 200) {
      console.log('result.data', result.data);
      if (result.data.length > 0) {
        onFetchPartner(result.data[0].partner);
        setIzbranPromet(result.data[0]);
      } else {
        setIzbranPromet(shifra);
      }
    }
  }, []);

  const fetchSinglePromet = (event) => {
    console.log('fetchSinglePromet', event.target.value);
    onFetchSinglePromet(event.target.value);
  };

  const onFetchArticles = useCallback(async () => {
    const result = await getRequest('/articles');
    if (result.status === 200) {
      setArticles(result.data);
    }
  }, []);

  const onFetchPartners = useCallback(async () => {
    const result = await getRequest('/delovniPartneri');
    if (result.status === 200) {
      setPartneri(result.data);
    }
  }, []);

  const addStavkaToPromet = () => {
    const newStavka = {
      shifra: '',
      broj: broj,
      artikal: '',
      kolicina: '',
      cena: '',
      vkupnaCenaBezDdv: '',
      ddv: '',
      presmetanDdv: '',
      iznos: '',
      vid: 'FK',
    };
    setStavki([...stavki, newStavka]);
  };

  const deleteStavkaFromPromet = (index) => {
    let newStavkiList = [...stavki];
    newStavkiList.splice(index, 1);
    setStavki(newStavkiList);
  };

  const presmetajKolicina = (event, index) => {
    let newStavkiList = [...stavki];
    newStavkiList.map((element, i) => {
      if (index === i) {
        element.kolicina = +event.target.value;
        element.vkupnaCenaBezDdv = element.cena * element.kolicina;
        element.presmetanDdv = (element.ddv / 100) * element.vkupnaCenaBezDdv;
        element.iznos =
          element.vkupnaCenaBezDdv +
          (element.ddv / 100) * element.vkupnaCenaBezDdv;
      }
      return element;
    });
    setStavki(newStavkiList);
  };

  const onNetoCenaChange = (event, index) => {
    let newStavkiList = [...stavki];
    newStavkiList.map((element, i) => {
      if (index === i) {
        element.cena = +event.target.value;
        element.vkupnaCenaBezDdv = element.cena * element.kolicina;
        element.presmetanDdv = (element.ddv / 100) * element.vkupnaCenaBezDdv;
        element.iznos =
          element.vkupnaCenaBezDdv +
          (element.ddv / 100) * element.vkupnaCenaBezDdv;
      }
      return element;
    });
    setStavki(newStavkiList);
  };

  const onPartnerChange = (event, partner) => {
    console.log('partner', partner);
    setIzbranPartner(partner);
  };

  const onStavkaShifraChange = (event, index, type) => {
    let newStavkiList = [...stavki];
    newStavkiList.map((element, i) => {
      if (index === i) {
        element[type] = event.target.value;
      }
      return element;
    });
    setStavki(newStavkiList);
  };

  const onArticleChange = (event, values, index) => {
    console.log('event', event.target.value);
    console.log('values', values);
    console.log('index', index);
    let newStavkiList = [...stavki];
    newStavkiList.map((element, i) => {
      console.log('element ', element, i, index);
      if (!values && index === i) {
        element.shifra = '';
        element.broj = broj;
        element.artikal = '';
        element.kolicina = 1;
        element.cena = 0;
        element.vkupnaCenaBezDdv = 0;
        element.ddv = 0;
        element.presmetanDdv = 0;
        element.iznos = 0;
      }

      if (values && index === i) {
        console.log('IF ', values.ime, index, i);
        element.broj = broj;
        element.artikal = values.shifra;
        element.kolicina = 1;
        element.cena = values.cena;
        element.vkupnaCenaBezDdv = values.cena;
        element.ddv = values.tarifen_broj_ddv;
        element.presmetanDdv = (values.tarifen_broj_ddv / 100) * values.cena;
        element.iznos =
          values.cena + (values.tarifen_broj_ddv / 100) * values.cena;
      }
      return element;
    });
    console.log('newStavkiList', newStavkiList);
    setStavki(newStavkiList);
  };

  const SetTotalWithoutDdv = () => {
    let total = 0;
    stavki.map((item) => {
      total += item.vkupnaCenaBezDdv;
      return item;
    });
    return <p className={classes.totalCostLabels}>{total ? total : 0}</p>;
  };

  const SetTotalWithDdv = () => {
    let total = 0;
    stavki.map((item) => {
      total += item.iznos;
      return item;
    });
    return (
      <p className={classes.totalCostLabels}>
        <strong>{total ? total : 0}</strong>
      </p>
    );
  };

  const SetTotalDdv = () => {
    let total = 0;
    stavki.map((item) => {
      total += item.presmetanDdv;
      return item;
    });
    return <p className={classes.totalCostLabels}>{total ? total : 0}</p>;
  };

  const onCreateStavki = async (path, body, promet) => {
    const result = await postRequest(path, body);
    console.log('onCreateStavki', result);
    if (result.status === 200) {
      setTimeout(() => {
        setLoading(false);
        onCreatePromet('/promet', promet);
      }, 1000);
    }
  };

  const onCreatePromet = async (path, body) => {
    const result = await postRequest(path, body);
    console.log('onCreatePromet', result);
    if (result.status === 200) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleSubmit = () => {
    console.log('handleSubmit');
    console.log('izbranPromet', izbranPromet);
    console.log('izbranPromet TYPE', typeof izbranPromet);
    console.log('izbranPromet PROPS NEW', props.isNewInvoice);
    console.log('izbranPartner', izbranPartner);
    console.log('broj', broj);
    console.log('stavki', stavki);
    console.log('datum', formatDate(date));
    setLoading(true);
    if (!(izbranPromet && date && izbranPartner)) {
      setLoading(false);
      return;
    }

    let vkupenIznos = 0;
    stavki.map((item) => {
      vkupenIznos += item.iznos;
      return item;
    });

    let novPromet = {
      shifra: brojNaFaktura,
      brojNaStavka: broj,
      partner: izbranPartner.shifra,
      datum: formatDate(date),
      iznos: vkupenIznos,
      vid: 'FK',
    };

    if (props.isNewInvoice && typeof izbranPromet === 'string') {
      console.log('props.isNewInvoice IF ', props.isNewInvoice);
      setLoading(false);
      // onCreatePromet('/promet', novPromet);
      onCreateStavki('/stavki', stavki, novPromet);
      props.history.push(`/invoice/${novPromet.brojNaFaktura}`);
      props.toggleInvoiceEditor();
    } else {
      console.log('props.isNewInvoice ELSE ', props.isNewInvoice);
      setLoading(false);
      props.toggleInvoiceEditor();
    }
  };

  return (
    <ValidatorForm
      ref={formRef}
      onSubmit={handleSubmit}
      onError={(errors) => handleSubmit()}
    >
      <div className={classes.rightButttons}>
        <Button
          type='button'
          className={classes.cancelButton}
          variant='text'
          onClick={() => props.toggleInvoiceEditor()}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='py-8'
          variant='contained'
          color='primary'
          disabled={loading}
        >
          Save
        </Button>
      </div>

      <div className={classes.orderInfo}>
        <div>
          <h4 className='mb-8'>Faktura</h4>
          <TextValidator
            label='Broj na faktura'
            onChange={(event) => setBrojNaFaktura(event.target.value)}
            type='text'
            fullWidth
            name='brojNaFaktura'
            value={brojNaFaktura}
            validators={['required']}
            errorMessages={['this field is required']}
            onBlur={fetchSinglePromet}
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
              value={date}
              fullWidth
              format='MMMM dd, yyyy'
              onChange={(date) => setDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div className={classes.textAlignRight}>
          <h4>Info za partner</h4>
          <Autocomplete
            id='najdiKlient'
            options={partneri}
            getOptionLabel={(option) => option.ime}
            style={{ minWidth: 210 }}
            onChange={(event, values) => onPartnerChange(event, values)}
            value={izbranPartner ? izbranPartner : ''}
            renderInput={(params) => (
              <TextField {...params} label='Izberi Partner' margin='normal' />
            )}
          />
        </div>
      </div>

      <Divider className={classes.divider} />

      {izbranPartner && (
        <Grid
          className='px-16 py-20'
          container
          justify='space-between'
          spacing={4}
        >
          <Grid item>
            <div>
              <h4>Info za partnerot</h4>
              <TextValidator
                className={classes.inputField}
                label='Danocen broj'
                type='text'
                name='danocenBroj'
                fullWidth
                value={izbranPartner.edb}
                validators={['required']}
                errorMessages={['this field is required']}
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
                value={izbranPartner.telefonski_broj}
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
                value={izbranPartner.ime}
                validators={['required']}
                errorMessages={['this field is required']}
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
                value={izbranPartner?.adresa}
                validators={['required']}
                errorMessages={['this field is required']}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </Grid>
        </Grid>
      )}

      {/* Item list for editing */}
      <Table className={classes.table}>
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell className='pl-sm-24'>#</TableCell>
            <TableCell className='px-0'>Broj</TableCell>
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
                    label='Shifra'
                    onChange={(event) =>
                      onStavkaShifraChange(event, index, 'shifra')
                    }
                    type='text'
                    name='shifraNaStavka'
                    value={item ? item.shifra : null}
                    validators={['required']}
                    errorMessages={['poleto e zadolzhitelno']}
                  />
                </TableCell>

                <TableCell>
                  <TextValidator
                    label='Broj'
                    onChange={(event) => {
                      setBroj(+event.target.value);
                    }}
                    type='number'
                    name='brojNaStavka'
                    value={broj}
                    validators={['required']}
                    errorMessages={['poleto e zadolzhitelno']}
                  />
                </TableCell>

                <TableCell className='pl-0 capitalize' align='left'>
                  <Autocomplete
                    id='imeNaArtikal'
                    options={articles}
                    getOptionLabel={(option) => option.ime}
                    style={{ minWidth: 210 }}
                    onChange={(event, values) =>
                      onArticleChange(event, values, index)
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
                    value={item ? item.kolicina : null}
                    validators={['required']}
                    errorMessages={['poleto e zadolzhitelno']}
                    disabled={!item.artikal}
                  />
                </TableCell>

                <TableCell className='pl-0 capitalize' align='left'>
                  <TextValidator
                    onChange={(event) => onNetoCenaChange(event, index)}
                    type='number'
                    label='Neto Cena'
                    name='cena'
                    value={item ? item.cena : null}
                    validators={['required']}
                    errorMessages={['poleto e zadolzhitelno']}
                  />
                </TableCell>

                <TableCell className='pl-0 capitalize' align='left'>
                  {item.ddv ? item.ddv : 0}%
                </TableCell>

                <TableCell className='pl-0 capitalize' align='left'>
                  {item.presmetanDdv ? item.presmetanDdv.toFixed(2) : ''}
                </TableCell>

                <TableCell className='pl-0 capitalize' align='left'>
                  {item.iznos ? item.iznos.toFixed(2) : ''}
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
        <Button onClick={addStavkaToPromet}>Dodadi Artikal</Button>
      </div>

      {/* total cost calculation */}
      <div className={classes.totalCostContainer}>
        <div className={classes.totalCost}>
          <div className={classes.totalCostLabelsContainer}>
            <p className={classes.totalCostLabels}>Vkupen iznos bez DDV:</p>
            <p className={classes.totalCostLabels}>Odobren Rabat:</p>
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
  );
};

export default InvoiceEditor;
