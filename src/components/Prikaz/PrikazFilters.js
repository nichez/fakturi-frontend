import React, { useState, useEffect, useContext, useCallback } from 'react';
import { TextField, Button, Card } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import useStyles from './styles';
import { getRequest } from '../../services/httpService';
import { PrikazContext } from './PrikazContext';

const PrikazFilters = () => {
  const classes = useStyles();

  const {
    vidNaPrometValue,
    godinaValue,
    mesecValue,
    sitePartneriValue,
    partnerValue,
    prometValue,
    searchValue
  } = useContext(PrikazContext);

  const [vidNaPromet, setVidNaPromet] = vidNaPrometValue;
  const [godina, setGodina] = godinaValue;
  const [mesec, setMesec] = mesecValue;
  const [sitePartneri, setSitePartneri] = sitePartneriValue;
  const [partner, setPartner] = partnerValue;
  const [promet, setPromet] = prometValue;
  const [search, setSearch] = searchValue;

  useEffect(() => {
    onFetchPartners();
  }, []);

  const onFetchPartners = useCallback(async () => {
    const result = await getRequest('/delovniPartneri');
    if (result.status === 200) {
      setSitePartneri(result.data);
    }
  }, []);

  const handleVidNaPromet = (event) => {
    setVidNaPromet(event.target.value);
  };

  const onPartnerChange = (event, partner) => {
    setPartner(partner);
  };

  const onDateChange = (date) => {
    setGodina(date);
    setMesec(date);
  };

  const resetFilters = () => {
    setVidNaPromet('');
    setGodina(null);
    setMesec(null);
    setSitePartneri([]);
    setPartner('');
    setPromet([]);
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const onFilter = async () => {
    const result = await getRequest(
      `/prikazPromet`,
      `?vid=${vidNaPromet}&godina=${
        godina ? godina.getFullYear() : ''
      }&partner=${partner ? partner.shifra : ''}&mesec=${
        mesec ? mesec.getMonth() + 1 : ''
      }`
    );
    if (result.status === 200) {
      setPromet(result.data);
    }
  };

  return (
    <Card className={classes.topRow}>
      <div className={classes.leftSide}>
        <FormControl className={classes.formControl}>
          <FormHelperText>Vid na promet</FormHelperText>
          <Select
            value={vidNaPromet}
            onChange={handleVidNaPromet}
            displayEmpty
            className={classes.selectEmpty}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={''}>Site</MenuItem>
            <MenuItem value={'FK'}>Fakturi</MenuItem>
            <MenuItem value={'PR'}>Priemnici</MenuItem>
            <MenuItem value={'SM'}>Smetki</MenuItem>
          </Select>
        </FormControl>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            className={classes.datePicker}
            views={['year']}
            label='Godina'
            value={godina}
            onChange={(date) => setGodina(date)}
          />
        </MuiPickersUtilsProvider>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            className={classes.datePicker}
            views={['year', 'month']}
            label='Mesec'
            value={mesec}
            openTo='month'
            onChange={(date) => onDateChange(date)}
          />
        </MuiPickersUtilsProvider>

        <Autocomplete
          id='prikazNajdiPartner'
          className={classes.control}
          options={sitePartneri}
          getOptionLabel={(option) => (option.ime ? option.ime : '')}
          style={{ minWidth: 210 }}
          onChange={(event, values) => onPartnerChange(event, values)}
          value={partner}
          renderInput={(params) => (
            <TextField {...params} label='Partner' multiline />
          )}
        />

        <Button
          className={classes.button}
          variant='contained'
          color='primary'
          onClick={() => onFilter()}
          style={{ textTransform: 'uppercase' }}
        >
          Search
        </Button>

        <Button
          className={classes.button}
          variant='outlined'
          color='primary'
          onClick={() => resetFilters()}
          style={{ textTransform: 'uppercase' }}
        >
          Reset
        </Button>
      </div>

      <div>
        <form noValidate autoComplete='off'>
          <TextField
            id='filter-promet'
            label='Prebaruvaj Promet'
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </form>
      </div>
    </Card>
  );
};

export default PrikazFilters;
