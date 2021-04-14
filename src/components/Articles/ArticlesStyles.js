import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  //Articles
  container: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 60,
  },
  searchContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    overflow: 'auto',
    marginTop: theme.spacing(3),
  },
  tableRow: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    cursor: 'pointer',
  },
  //Article Editor Dialog
  dialog: {
    padding: theme.spacing(5),
  },
  dialogCancel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
  },
  dialogInput: {
    marginTop: theme.spacing(5),
  },
  spinner: {
    marginLeft: 160,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

export default useStyles;
