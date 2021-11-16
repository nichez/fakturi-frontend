import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 60,
  },
  topRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: theme.spacing(4),
    background: grey[100],
  },
  formControl: {
    minWidth: 120,
  },
  control: {
    marginLeft: 50,
    minWidth: 120,
  },
  datePicker: {
    maxWidth: 70,
    marginLeft: 50,
    minWidth: 120,
  },
  partnerControl: {
    marginLeft: 50,
  },
  button: {
    textTransform: 'uppercase',
    marginLeft: 20,
  },
  leftSide: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  card: {
    width: '100%',
    overflow: 'auto',
    marginTop: theme.spacing(8),
  },
  tableRow: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    cursor: 'pointer',
  },
  iznos: {
    fontWeight: theme.typography.fontWeightBold,
    color: '#009688',
    fontStyle: 'italic'
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(8),
  },
  barChart: {
    flex: 1,
    marginRight: theme.spacing(8),
    padding: theme.spacing(2),
  },
  pieChart: {
    flex: 1,
    padding: theme.spacing(2),
  }
}));

export default useStyles;
