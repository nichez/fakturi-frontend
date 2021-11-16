import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,
  Typography,
  Checkbox,
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import useStyles from './ArticlesStyles';
import { postRequest, putRequest } from '../../services/httpService';

const ArticleEditorDialog = (props) => {
  const classes = useStyles();
  const formRef = useRef('form');

  const { article, handleClose, open } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [shifra, setShifra] = useState(article ? article.shifra : '');
  const [ime, setIme] = useState(article ? article.ime : '');
  const [cena, setCena] = useState(article ? article.cena : '');
  const [edinecnaMerka, setEdinecnaMerka] = useState(
    article ? article.edinecna_merka : ''
  );
  const [tarifenBroj, setTarifenBroj] = useState(
    article ? article.tarifen_broj_ddv : 0
  );
  const [makedonskiProizvod, setMakedonskiProizvod] = useState(
    article && article.mkd_proizvod === 'DA' ? true : false
  );

  useEffect(() => {
    if (article) {
      if (article.tarifen_broj_ddv === 5) {
        setTarifenBroj(1);
      } else if (article.tarifen_broj_ddv === 18) {
        setTarifenBroj(2);
      }
    }
  }, []);

  const onCreateArticle = async (path, body) => {
    const result = await postRequest(path, body);
    if (result.status === 200 || result.status === 201) {
      setTimeout(() => {
        setIsLoading(false);
        handleClose('create');
      }, 1000);
    }
  };

  const onUpdateArticle = async (path, body, params) => {
    console.log('onUpdateArticle body ', body);
    console.log('onUpdateArticle params ', params);
    const result = await putRequest(path, body, params);
    console.log('onUpdateArticle result ', result);
    if (result.status === 200 || result.status === 201) {
      setTimeout(() => {
        setIsLoading(false);
        handleClose('update');
      }, 1000);
    }
  };

  const handleChange = (event, source) => {
    switch (source) {
      case 'shifra':
        return setShifra(event.target.value);
      case 'ime':
        return setIme(event.target.value);
      case 'cena':
        return setCena(+event.target.value);
      case 'edinecnaMerka':
        return setEdinecnaMerka(event.target.value);
      case 'tarifenBroj':
        return setTarifenBroj(+event.target.value);
      default:
        return;
    }
  };

  const handleChangeMkProizvod = (event) => {
    setMakedonskiProizvod(event.target.checked);
  };

  const handleFormSubmit = () => {
    setIsLoading(true);
    const newArticle = {
      shifra,
      ime,
      edinecna_merka: edinecnaMerka,
      tarifen_broj_ddv: tarifenBroj,
      mkd_proizvod: makedonskiProizvod ? 'DA' : 'NE',
      cena,
      datum: formatDate(new Date()),
    };

    console.log('article ', article);
    if (article) {
      onUpdateArticle('/articles', newArticle, `/${article.shifra}`);
    } else {
      onCreateArticle('/articles', newArticle);
    }
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

  return (
    <Dialog
      onClose={() => handleClose()}
      open={open}
      fullWidth
      maxWidth={'md'}
      disableBackdropClick={isLoading}
    >
      <div className={classes.dialog}>
        <Typography variant='h5'>
          {article ? article.ime : 'Kreiraj Nov Artikal'}
        </Typography>
        <ValidatorForm ref={formRef} onSubmit={handleFormSubmit}>
          <Grid container spacing={8}>
            <Grid item sm={6} xs={12}>
              {article && (
                <TextValidator
                  fullWidth
                  className={classes.dialogInput}
                  label='Shifra'
                  onChange={(event) => handleChange(event, 'shifra')}
                  type='text'
                  name='shifra'
                  value={shifra}
                  validators={['required']}
                  errorMessages={['poleto e zadolzhitelno']}
                  disabled
                />
              )}
              <TextValidator
                fullWidth
                className={classes.dialogInput}
                label='Cena'
                onChange={(event) => handleChange(event, 'cena')}
                type='number'
                name='cena'
                value={cena}
                validators={['required']}
                errorMessages={['poleto e zadolzhitelno']}
              />
              <FormControl fullWidth className={classes.dialogInput}>
                <Select
                  value={tarifenBroj}
                  defaultValue={tarifenBroj}
                  onChange={(event) => handleChange(event, 'tarifenBroj')}
                  displayEmpty
                  className={classes.selectEmpty}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value={0}>0%</MenuItem>
                  <MenuItem value={1}>5%</MenuItem>
                  <MenuItem value={2}>18%</MenuItem>
                </Select>
                <FormHelperText>Tarifen broj (DDV) %</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextValidator
                fullWidth
                className={classes.dialogInput}
                label='Ime'
                onChange={(event) => handleChange(event, 'ime')}
                type='text'
                name='ime'
                value={ime}
                validators={['required']}
                errorMessages={['poleto e zadolzhitelno']}
                multiline
              />
              <TextValidator
                fullWidth
                className={classes.dialogInput}
                label='Edinecna Merka'
                onChange={(event) => handleChange(event, 'edinecnaMerka')}
                type='text'
                name='edinecnaMerka'
                value={edinecnaMerka}
                errorMessages={['poleto e zadolzhitelno']}
              />
              <FormControlLabel
                className={classes.dialogInput}
                control={
                  <Checkbox
                    color='primary'
                    checked={makedonskiProizvod}
                    onChange={handleChangeMkProizvod}
                  />
                }
                label='Makedonski Proizvod'
                labelPlacement='start'
              />
            </Grid>
          </Grid>

          <div className={classes.dialogCancel}>
            {isLoading ? (
              <div className={classes.spinner}>
                <CircularProgress color='secondary' />
              </div>
            ) : (
              <Button
                variant='contained'
                color='secondary'
                type='submit'
                fullWidth
                style={{ marginRight: 5 }}
              >
                Save
              </Button>
            )}
            <Button onClick={() => handleClose()} fullWidth>
              Cancel
            </Button>
          </div>
        </ValidatorForm>
      </div>
    </Dialog>
  );
};

export default ArticleEditorDialog;
