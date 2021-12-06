import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Icon,
  Button,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Card,
  Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';

import './printStyles.css';
import useStyles from './PrometDetailsStyles';
import { getRequest, postRequest } from '../../../services/httpService';

const formatDate = (date) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const PrometDetails = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [brojNaFaktura, setBrojNaFaktura] = useState('');
  const [partner, setPartner] = useState();
  const [datum, setDatum] = useState('');
  const [stavki, setStavki] = useState([]);
  const [vidNaPromet, setVidNaPromet] = useState('');
  const [vkupenIznos, setVkupenIznos] = useState(0);

  useEffect(() => {
    getFakturaByShifra(props.match.params.id);
  }, []);

  const getFakturaByShifra = useCallback(async (shifra) => {
    const result = await getRequest(`/promet/${shifra}`);
    if (result.status === 200) {
      console.log('getFaktura res ', result.data);
      setBrojNaFaktura(result.data.shifra);
      setVidNaPromet(result.data.vid);
      setDatum(formatDate(result.data.datum));
      setVkupenIznos(result.data.iznos);

      onFetchPartner(result.data.partner);
      onFetchStavki(result.data.shifra);
    }
  }, []);

  const onFetchPartner = useCallback(async (shifra) => {
    const result = await getRequest('/delovniPartneri/', shifra);
    if (result.status === 200 || result.status === 201) {
      setPartner(result.data);
    }
  }, []);

  const onFetchStavki = useCallback(async (broj) => {
    const result = await getRequest(`/stavki/byBroj/${broj}`);
    if (result.status === 200 || result.status === 201) {
      setStavki(result.data);
    }
  }, []);

  const VkupenIznosBezDdv = () => {
    let total = 0;
    stavki.map((item) => {
      total += +item.vkupnaCenaBezDdv;
      return item;
    });

    return (
      <Typography variant='h6'>{total ? total.toFixed(2) : 0} MKD</Typography>
    );
  };

  const VkupenPresmetanDdv = () => {
    let total = 0;
    stavki.map((item) => {
      total += +item.presmetanDdv;
      return item;
    });

    return (
      <Typography variant='h6'>{total ? total.toFixed(2) : 0} MKD</Typography>
    );
  };

  const goToEdit = (promet) => {
    let path = `/promet/${promet}`;
    history.push(path, promet);
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className={classes.content}>
      <div className={classes.actionButtons}>
        <IconButton onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>
        <div>
          <Button
            className={classes.editButton}
            variant='contained'
            color='primary'
            onClick={() => goToEdit(brojNaFaktura)}
          >
            Edit Invoice
          </Button>
          <Button
            onClick={() => window.print()}
            className='py-8'
            variant='contained'
            color='secondary'
          >
            Print Invoice
          </Button>
        </div>
      </div>

      <div id='print-area'>
        <div className={classes.orderInfo}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant='subtitle2' style={{ marginBottom: 5 }}>
              Broj na faktura
            </Typography>
            <Typography variant='body2'># {brojNaFaktura}</Typography>
          </div>
          <div className={classes.logoTitleContainer}>
            <img
              src='/assets/images/logo-placeholder.jpg'
              alt='logo'             
              id='logo-na-firma'
              className={classes.logo}
            />
            <Typography variant='h6'>Ime Na Firma</Typography>
          </div>
          <div className={classes.orderStatusContainer}>
            <Typography variant='subtitle2' className={classes.orderStatus}>
              Datum:
              <Typography variant='body2' style={{ marginLeft: 5 }}>
                {datum}
              </Typography>
            </Typography>
          </div>
        </div>

        <Divider />

        <div className={classes.billingInfo}>
          <div className={classes.billFrom}>
            <Typography variant='subtitle2' style={{ marginBottom: 10 }}>
              Firma
            </Typography>
            <Typography variant='body2' style={{ marginBottom: 10 }}>
              {/* {firma info} */}
            </Typography>
            <Typography variant='body2' style={{ marginBottom: 10 }}>
              {/* {firma info} */}
            </Typography>
          </div>
          <div className={classes.billTo}>
            <Typography variant='subtitle2' style={{ marginBottom: 10 }}>
              {partner?.ime}
            </Typography>
            <Typography variant='body2' style={{ marginBottom: 10 }}>
              {partner?.adresa}
            </Typography>
            <Typography variant='body2' style={{ marginBottom: 10 }}>
              {partner?.telefonski_broj}
            </Typography>
          </div>
          <div />
        </div>

        <Card elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant='subtitle2'>#</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Ime</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Em</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Kolicina</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Neto Cena</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Tarifa DDV(%)</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Presmetan DDV</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Vrednost so DDV</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stavki
                .sort((a, b) => (a.rbs > b.rbs ? 1 : -1))
                .map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.rbs}</TableCell>
                      <TableCell>{item.artikal.ime}</TableCell>
                      <TableCell>{item.artikal.edinecna_merka}</TableCell>
                      <TableCell>{item.kolicina}</TableCell>
                      <TableCell>{item.cena}</TableCell>
                      <TableCell>{item.ddv}</TableCell>
                      <TableCell>{item.presmetanDdv}</TableCell>
                      <TableCell>{item.iznos}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Card>

        <div className={classes.totalContainer}>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: 48 }}>
              <Typography variant='h6'>Vkupen iznos bez ddv:</Typography>
              <Typography variant='h6'>Vkupno Ddv:</Typography>
              <Typography variant='h6' className={classes.fontWeightBold}>
                Vkupen iznos:
              </Typography>
            </div>
            <div>
              <VkupenIznosBezDdv />
              <VkupenPresmetanDdv />
              <Typography variant='h6' className={classes.fontWeightBold}>
                {vkupenIznos.toFixed(2)} MKD
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrometDetails;
