import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Grid, Button, CircularProgress } from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import useStyles from './LoginStyles';
import { postRequest } from '../../../services/httpService';

const Login = (props) => {
  const classes = useStyles();
  const formRef = useRef('form');
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const redirectToDashboard = () => {
    let path = '/promet/list/fakturi';
    history.replace(path);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = await postRequest('/login', { username, password });

    if (result.status === 200 || result.status === 201) {
      setLoading(false);
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('username', result.data.username);
      redirectToDashboard();
    } else {
      const { message } = result;
      setLoading(false);
      setErrorMessage(message);
      setOpenSnackbar(true);
    }
  };

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <div className={classes.content}>
      <Card className={classes.loginCard}>
        <Grid container>
          <Grid item lg={5} md={5} sm={5} xs={12}>
            <div className={classes.imageContainer}>
              <img
                src='/assets/images/invoice-logo.png'
                alt=''
                className={classes.image}
              />
            </div>
          </Grid>
          <Grid item lg={7} md={7} sm={7} xs={12}>
            <div className={classes.loginForm}>
              <ValidatorForm
                ref={formRef}
                onSubmit={handleSubmit}
                onError={(errors) => handleSubmit()}
              >
                <TextValidator
                  className={classes.inputUsername}
                  variant='outlined'
                  label='Username'
                  onChange={handleUsername}
                  type='text'
                  name='username'
                  value={username}
                  validators={['required']}
                  errorMessages={['Poleto e zadolzhitelno']}
                />
                <TextValidator
                  className={classes.inputPassword}
                  label='Password'
                  variant='outlined'
                  onChange={handlePassword}
                  name='password'
                  type='password'
                  value={password}
                  validators={['required']}
                  errorMessages={['Poleto e zadolzhitelno']}
                />
                <div className={classes.wrapperContainer}>
                  <div className={classes.wrapper}>
                    <Button
                      variant='contained'
                      color='primary'
                      disabled={loading}
                      type='submit'
                      fullWidth
                    >
                      Login
                    </Button>
                    {loading && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </div>
                  <span className={classes.buttonSpace}>or</span>
                  <Button
                    className={classes.capitalize}
                    onClick={() => this.props.history.push('/session/signup')}
                  >
                    Register
                  </Button>
                </div>
                <Button
                  className={classes.primary}
                  onClick={() =>
                    this.props.history.push('/session/forgot-password')
                  }
                >
                  Forgot password?
                </Button>
              </ValidatorForm>
            </div>
          </Grid>
        </Grid>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity='error'>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
