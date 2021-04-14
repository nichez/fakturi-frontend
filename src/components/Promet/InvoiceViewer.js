import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
// import { getInvoiceById } from "./InvoiceService";
import { format } from 'date-fns';
import './Invoice.css';

const InvoiceViewer = (props) => {
  const classes = useStyles();

  const [orderNo, setOrderNo] = useState('');
  const [buyer, setBuyer] = useState({ name: '', address: '' });
  const [seller, setSeller] = useState({ name: '', address: '' });
  const [item, setItem] = useState([]);
  const [status, setStatus] = useState('');
  const [vat, setVat] = useState('');
  const [date, setDate] = useState(new Date());

  let subTotalCost = 0;

  // console.log('INVOICE VIEWER BROJ NA FAKTURA', props.location);

  return (
    <React.Fragment>
      <div className={classes.actionButtons}>
        <Link to='/invoice/list'>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <div>
          <Button
            className={classes.editButton}
            variant='contained'
            color='primary'
            onClick={() => {}}
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
            <Typography variant='subtitle1' style={{ marginBottom: 10 }}>
              Info za firmata
            </Typography>
            <Typography variant='subtitle2' style={{ marginBottom: 5 }}>
              Broj na faktura
            </Typography>
            <Typography variant='body2'># 13123123{orderNo}</Typography>
          </div>
          <div className={classes.orderStatusContainer}>
            <Typography variant='subtitle2' className={classes.orderStatus}>
              Info za klientot
              <Typography variant='body2' style={{ marginLeft: 5 }}>
                
              </Typography>
            </Typography>
            <Typography variant='subtitle2' className={classes.orderStatus}>
              Datum:
              <Typography variant='body2' style={{ marginLeft: 5 }}>
                {date ? format(new Date(date).getTime(), 'MMMM dd, yyyy') : ''}
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
              {seller ? seller.name : null}
            </Typography>
            <Typography variant='body2' style={{ marginBottom: 10 }}>
              {seller ? seller.address : null}
            </Typography>
          </div>
          <div className={classes.billTo}>
            <Typography variant='subtitle2' style={{ marginBottom: 10 }}>
              Klient
            </Typography>
            <Typography variant='body2' style={{ marginBottom: 10 }}>
              {buyer ? buyer.name : null}
            </Typography>
            <Typography variant='body2' style={{ marginBottom: 10 }}>
              {buyer ? buyer.address : null}
            </Typography>
          </div>
          <div />
        </div>

        <Card className='mb-16' elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='pl-sm-24'>#</TableCell>
                <TableCell className='px-0'>Ime</TableCell>
                <TableCell className='px-0'>EM</TableCell>
                <TableCell className='px-0'>Kolicina</TableCell>
                <TableCell className='px-0'>Neto Cena</TableCell>
                <TableCell className='px-0'>Rabat(%)</TableCell>
                <TableCell className='px-0'>Tarifa DDV(%)</TableCell>
                <TableCell className='px-0'>Presmetan DDV</TableCell>
                <TableCell className='px-0'>Vrednost so DDV</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item.map((item, index) => {
                subTotalCost += item.unit * item.price;
                return (
                  <TableRow key={index}>
                    <TableCell className='pl-sm-24 capitalize' align='left'>
                      {index + 1}
                    </TableCell>
                    <TableCell className='pl-0 capitalize' align='left'>
                      {item.name}
                    </TableCell>
                    <TableCell className='pl-0 capitalize' align='left'>
                      {item.price}
                    </TableCell>
                    <TableCell className='pl-0 capitalize'>
                      {item.unit}
                    </TableCell>
                    <TableCell className='pl-0'>
                      {item.unit * item.price}
                    </TableCell>
                    <TableCell className='pl-0'>
                      {item.unit * item.price}
                    </TableCell>
                    <TableCell className='pl-0'>
                      {item.unit * item.price}
                    </TableCell>
                    <TableCell className='pl-0'>
                      {item.unit * item.price}
                    </TableCell>
                    <TableCell className='pl-0'>
                      {item.unit * item.price}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        <div className={classes.totalContainer}>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: 48 }}>
              <p className='mb-16'>Sub Total:</p>
              <p className='mb-16'>Vat(%):</p>
              <strong>
                <p>Grand Total:</p>
              </strong>
            </div>
            <div>
              <p className='mb-16'>{subTotalCost}</p>
              <p className='mb-16'>{vat}</p>
              <p>
                <strong>${(subTotalCost += (subTotalCost * vat) / 100)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  orderInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 15,
  },
  billingInfo: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  editButton: {
    marginRight: 16,
  },
  orderStatusContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  orderStatus: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  billFrom: {
    textAlign: 'left',
    width: '100%',
    marginTop: 15,
  },
  billTo: {
    textAlign: 'right',
    width: '100%',
    marginTop: 15,
  },
  totalContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
}));

export default InvoiceViewer;
