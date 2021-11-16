"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _styles = require("@material-ui/core/styles");

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    container: {
      flexGrow: 1,
      padding: theme.spacing(3),
      marginTop: 60
    },
    card: {
      width: '100%',
      overflow: 'auto',
      marginTop: theme.spacing(3)
    },
    searchContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      marginBottom: theme.spacing(2)
    },
    tableRow: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
      },
      cursor: 'pointer'
    }
  };
});
var _default = useStyles;
exports["default"] = _default;