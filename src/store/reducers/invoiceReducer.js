import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  invoices: [],
  error: null,
  loading: false,
};

const fetchInvoicesStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const fetchInvoicesSuccess = (state, action) => {
  return updateObject(state, {
    invoices: action.invoices,
    error: null,
    loading: false,
  });
};

const fetchInvoicesFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};

// Create Invoice
const createInvoiceSuccess = (state, action) => {
  console.log('reducer create', action.invoice);
  const newInvoice = {...action.invoice}

  let updatedState;
  updatedState = [...state.invoices, newInvoice];

  return updateObject(state, {
    invoices: updatedState
  });
}

const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_INVOICES_START:
      return fetchInvoicesStart(state, action);
    case actionTypes.FETCH_INVOICES_SUCCESS:
      return fetchInvoicesSuccess(state, action);
    case actionTypes.FETCH_INVOICES_FAIL:
      return fetchInvoicesFail(state, action);
      case actionTypes.CREATE_INVOICE_SUCCESS:
      return createInvoiceSuccess(state, action);
    default:
      return state;
  }
};

export default invoiceReducer;
