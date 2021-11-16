"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _styles = require("@material-ui/core/styles");

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      marginTop: 60
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    orderInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginTop: 15
    },
    billingInfo: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    editButton: {
      marginRight: 16
    },
    orderStatusContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start'
    },
    orderStatus: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    billFrom: {
      textAlign: 'left',
      width: '100%',
      marginTop: 15
    },
    billTo: {
      textAlign: 'right',
      width: '100%',
      marginTop: 15
    },
    totalContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 36
    },
    fontWeightBold: {
      fontWeight: 'bold'
    }
  };
});
var _default = useStyles;
exports["default"] = _default;