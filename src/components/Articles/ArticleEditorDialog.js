import React, { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  Checkbox,
  Divider,
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    article ? article.tarifen_broj_ddv : ''
  );
  const [makedonskiProizvod, setMakedonskiProizvod] = useState(
    article && article.mkd_proizvod === 'DA' ? true : false
  );

  const onCreateArticle = async (path, body) => {
    const result = await postRequest(path, body);
    if (result.status === 200) {
      setTimeout(() => {
        setIsLoading(false);
        handleClose('create');
      }, 1000);
    }
  };

  const onUpdateArticle = async (path, body, params) => {
    const result = await putRequest(path, body, params);
    if (result.status === 200) {
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
        return setCena(event.target.value);
      case 'edinecnaMerka':
        return setEdinecnaMerka(event.target.value);
      case 'tarifenBroj':
        return setTarifenBroj(event.target.value);
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
      datum: new Date(),
    };

    if (article) {
      onUpdateArticle('/articles', newArticle, `/${article.shifra}`);
    } else {
      onCreateArticle('/articles', newArticle);
    }
  };

  return (
    <Dialog onClose={() => handleClose()} open={open} fullWidth maxWidth={'md'} disableBackdropClick={isLoading}>
      <div className={classes.dialog}>
        <Typography variant='h5'>
          {article ? article.ime : 'Kreiraj Nov Artikal'}
        </Typography>
        <ValidatorForm ref={formRef} onSubmit={handleFormSubmit}>
          <Grid container spacing={8}>
            <Grid item sm={6} xs={12}>
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
                disabled={article !== null}
              />
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
              <TextValidator
                fullWidth
                className={classes.dialogInput}
                label='Tarifen Broj (DDV) %'
                onChange={(event) => handleChange(event, 'tarifenBroj')}
                type='number'
                name='tarifenBroj'
                value={tarifenBroj}
                validators={['required']}
                errorMessages={['poleto e zadolzhitelno']}
              />
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
              />
              <TextValidator
                fullWidth
                className={classes.dialogInput}
                label='Edinecna Merka'
                onChange={(event) => handleChange(event, 'edinecnaMerka')}
                type='text'
                name='edinecnaMerka'
                value={edinecnaMerka}
                validators={['required']}
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
