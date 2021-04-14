import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  //Invoice Editor
  rightButttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  cancelButton: {
    marginRight: 16,
  },
  orderInfo: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  inputField: {
    marginTop: 16,
  },
  formControls: {
    width: '100%',
  },
  textAlignRight: {
    textAlign: 'right',
  },
  fontWeightNormal: {
    fontWeight: 'normal',
  },
  divider: {
    marginTop: 20,
  },
  table: {
    marginTop: 20,
  },
  tableRow: {
    background: 'rgba(0, 0, 0, 0.08)',
  },
  addItemButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalCostContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1),
    fontSize: 16
  },
  totalCost: {
    display: 'flex',
  },
  totalCostLabelsContainer: {
    marginRight: 48,
  },
  totalCostLabels: {
    marginBottom: 16,
  },
  datePicker: {
    marginTop: 16,
  },
  //new invoice editor
  partnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 16,
  }
}));

export default useStyles;
