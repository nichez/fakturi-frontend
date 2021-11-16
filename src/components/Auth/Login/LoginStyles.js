import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#1A2038',
  },
  loginCard: {
    maxWidth: 800,
    borderRadius: 12,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 32,
    marginLeft: 30,
    marginRight: 30
  },
  image: {
    width: 200,
    borderRadius: 12,
    marginBottom: 50
  },
  loginForm: {
    height: '100%',
    background: `rgba(0, 0, 0, 0.08)`,
    position: 'relative',
    padding: 36,
  },
  inputUsername: {
    width: '100%',
    marginBottom: 24,
  },
  inputPassword: {
    width: '100%',
    marginBottom: 16,
  },
  wrapperContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  wrapper: {
    position: 'relative',
    width: '100%'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonSpace: {
    marginLeft: 16,
    marginRight: 8
  },
  capitalize: {
    textTransform: 'capitalize' 
  },
  primary: {
    color: theme.palette.primary.main
  }
}));

export default useStyles;
