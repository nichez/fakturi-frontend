import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 60
    // marginInline: 80,
    // marginBlock: 100
  },
  topRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightButttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  cancelButton: {
    marginRight: 16,
  },
  fakturaInfo: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  textAlignRight: {
    textAlign: 'right',
  },
  divider: {
    marginTop: 20,
  },
  inputField: {
    marginTop: 16,
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
}));

export default useStyles;
