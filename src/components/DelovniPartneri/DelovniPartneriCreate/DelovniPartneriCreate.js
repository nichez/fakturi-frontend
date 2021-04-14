import React, { useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Grid, Typography, Card } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import useStyles from './styles';
import { postRequest, putRequest } from '../../../services/httpService';

const DelovniPartneriCreate = (props) => {
  const classes = useStyles();
  const formRef = useRef('form');
  const history = useHistory();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [shifra, setShifra] = useState(
    location.state ? location.state.shifra : ''
  );
  const [ime, setIme] = useState(location.state ? location.state.ime : '');
  const [adresa, setAdresa] = useState(
    location.state ? location.state.adresa : ''
  );
  const [telefonskiBroj, setTelefonskiBroj] = useState(
    location.state ? location.state.telefonskiBroj : ''
  );
  const [bankaDeponent, setBankaDeponent] = useState(
    location.state ? location.state.bankaDeponent : ''
  );
  const [edb, setEdb] = useState(
    location.state ? location.state.edb : ''
  );

  const onCreatePartner = async (path, body) => {
    const result = await postRequest(path, body);
    if (result.status === 200) {
      setTimeout(() => {
        setIsLoading(false);
        setShifra('');
        setIme('');
        setAdresa('');
        setTelefonskiBroj('');
        setBankaDeponent('');
        setEdb('');
        setSuccessMessage(
            location.state
            ? 'Delovniot partner e uspeshno promenet!'
            : 'Delovniot partner e uspeshno kreiran!'
        );
        setOpenSnackbar(true);
      }, 1000);
    }
  };

  const onUpdatePartner = async (path, body, params) => {
    const result = await putRequest(path, body, params);
    if (result.status === 200) {
      setTimeout(() => {
        setIsLoading(false);
        setShifra('');
        setIme('');
        setAdresa('');
        setTelefonskiBroj('');
        setBankaDeponent('');
        setEdb('');
        setSuccessMessage(
          !location.state
            ? 'Delovniot partner e uspeshno kreiran!'
            : 'Delovniot partner e uspeshno promenet!'
        );
        setOpenSnackbar(true);
      }, 1000);
    }
  };

  const handleFormSubmit = () => {
    setIsLoading(true);
    const newPartner = {
      shifra,
      ime,
      adresa,
      telefonski_broj: telefonskiBroj,
      banka_deponent: bankaDeponent,
      edb
    };

    if (location.state) {
      onUpdatePartner(
        '/delovniPartneri',
        newPartner,
        `/${location.state.shifra}`
      );
    } else {
      onCreatePartner('/delovniPartneri', newPartner);
    }
  };

  const handleChange = (event, source) => {
    switch (source) {
      case 'shifra':
        return setShifra(event.target.value);
      case 'ime':
        return setIme(event.target.value);
      case 'adresa':
        return setAdresa(event.target.value);
      case 'telefonskiBroj':
        return setTelefonskiBroj(event.target.value);
      case 'bankaDeponent':
        return setBankaDeponent(event.target.value);
      default:
        return;
    }
  };

  const goBackToPartnerList = () => {
    // let path = `/delovniPartneri/list`;
    history.goBack();
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

  return (
    <div className={classes.container}>
      <Typography variant='h5'>Kreiraj Nov Partner</Typography>
      <Card className={classes.card}>
        <ValidatorForm
          ref={formRef}
          onSubmit={handleFormSubmit}
          onError={(errors) => {}}
        >
          <Grid container spacing={6}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextValidator
                className={classes.inputField}
                fullWidth
                label='Shifra'
                onChange={(event) => handleChange(event, 'shifra')}
                type='text'
                name='shifra'
                value={shifra}
                validators={['required']}
                errorMessages={['poleto e zadolzhitelno']}
              />
              <TextValidator
                className={classes.inputField}
                fullWidth
                label='Adresa na partnerot'
                onChange={(event) => handleChange(event, 'adresa')}
                type='text'
                name='adresaNaPartner'
                value={adresa}
                validators={['required']}
                errorMessages={['poleto e zadolzhitelno']}
              />
              <TextValidator
                className={classes.inputField}
                fullWidth
                label='Banka Deponent'
                onChange={(event) => handleChange(event, 'bankaDeponent')}
                type='text'
                name='bankaDeponent'
                value={bankaDeponent}
                validators={['required']}
                errorMessages={['poleto e zadolzhitelno']}
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextValidator
                className={classes.inputField}
                fullWidth
                label='Ime na partnerot'
                onChange={(event) => handleChange(event, 'ime')}
                type='text'
                name='imeNaPartner'
                value={ime}
                validators={['required']}
                errorMessages={['poleto e zadolzhitelno']}
              />
              <TextValidator
                className={classes.inputField}
                fullWidth
                label='Telefonski Broj'
                onChange={(event) => handleChange(event, 'telefonskiBroj')}
                type='text'
                name='brojNaPartner'
                value={telefonskiBroj}
                validators={['required']}
                errorMessages={['poleto e zadolzhitelno']}
              />
              <TextValidator
                className={classes.inputField}
                fullWidth
                label='Edinstven Danocen Broj'
                onChange={(event) => handleChange(event, 'edb')}
                type='text'
                name='edb'
                value={edb}
                validators={['required']}
                errorMessages={['poleto e zadolzhitelno']}
              />
            </Grid>
          </Grid>
          <div className={classes.buttons}>
            {isLoading ? (
              <div className={classes.spinner}>
                <CircularProgress color='secondary' />
              </div>
            ) : (
              <div>
                <Button
                  color='primary'
                  variant='contained'
                  type='submit'
                  className={classes.buttonSave}
                >
                  <span className='pl-8 capitalize'>Save</span>
                </Button>
                <Button
                  color='primary'
                  className={classes.buttonCancel}
                  onClick={goBackToPartnerList}
                >
                  <span className='pl-8 capitalize'>Cancel</span>
                </Button>
              </div>
            )}
          </div>
        </ValidatorForm>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity='success'>
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DelovniPartneriCreate;
