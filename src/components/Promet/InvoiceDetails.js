import React, { useState, useEffect } from 'react';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import InvoiceViewer from './InvoiceViewer';
import InvoiceEditor from './InvoiceEditor/InvoiceEditor';

const InvoiceDetails = (props) => {
  const classes = useStyles();

  const [showInvoiceEditor, setShowInvoiceEditor] = useState(false);
  const [isNewInvoice, setIsNewInvoice] = useState(false);

  const toggleInvoiceEditor = () => {
      console.log('toggleInvoiceEditor', showInvoiceEditor, isNewInvoice)
    setShowInvoiceEditor((prevState) => !prevState);
    setIsNewInvoice(false);
  };

  useEffect(() => {
    if (props.match.params.id === 'add') {
      setShowInvoiceEditor(true);
      setIsNewInvoice(true);
    }
  }, []);

  return (
    <Card elevation={6} className={classes.content}>
      {showInvoiceEditor ? (
        <InvoiceEditor
          toggleInvoiceEditor={toggleInvoiceEditor}
          isNewInvoice={isNewInvoice}
        />
      ) : (
        <InvoiceViewer toggleInvoiceEditor={toggleInvoiceEditor} />
      )}
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 60,
  },
}));

export default InvoiceDetails;
