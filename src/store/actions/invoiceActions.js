import axios from 'axios';
import * as actionTypes from './actionTypes';
import data from '../../fakedb/invoices.json';

// Fetch Invoices
export const fetchInvoicesStart = () => {
  return {
    type: actionTypes.FETCH_INVOICES_START,
  };
};

export const fetchInvoicesSuccess = (invoices) => {
  console.log("FETCH DATA ", invoices.data)
  return {
    type: actionTypes.FETCH_INVOICES_SUCCESS,
    invoices: invoices.data,
  };
};

export const fetchInvoicesFail = (error) => {
  return {
    type: actionTypes.FETCH_INVOICES_FAIL,
    error: error,
  };
};

export const fetchInvoices = () => {
  return (dispatch) => {
    dispatch(fetchInvoicesStart());
    dispatch(fetchInvoicesSuccess(data));
  };
};

// Create new Invoice
export const createInvoiceStart = () => {
  return {
    type: actionTypes.CREATE_INVOICE_START,
  };
};

export const createInvoiceSuccess = (invoice) => {
  return {
    type: actionTypes.CREATE_INVOICE_SUCCESS,
    invoice: invoice,
  };
};

export const createInvoiceFail = (error) => {
  return {
    type: actionTypes.CREATE_INVOICE_FAIL,
    error: error,
  };
};

export const createInvoice = (invoice) => {
  return (dispatch) => {
    dispatch(createInvoiceStart());
    dispatch(createInvoiceSuccess(invoice));
  };
};