import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 70,
    padding: theme.spacing(2),
  },
  card: {
    flexGrow: 1,
    padding: theme.spacing(8),
    margin: theme.spacing(8),
  },
  inputField: {
    marginBottom: theme.spacing(3),
  },
  buttonSave: {
    marginTop: theme.spacing(1),
  },
  buttonCancel: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  buttons: {
    // display: 'flex',
    // justifyContent: 'space-between',
  },
  spinner: {
    marginLeft: 160,
  },
}));

export default useStyles;
