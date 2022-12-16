import React, { useState } from 'react';

import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { registerUser } from '../../api/signUp';

const defaultLabels = {
  userName: 'User name',
  email: 'Email',
  password: 'Password',
  passwordVerify: 'Verify password',
};

const defaultErrorLabels = {
  passwordMinLength: 'Password must contain at least 8 characters',
  passwordsMustMatch: 'Passwords must match',
};

const initialIsFieldError = {
  userName: false,
  email: false,
  password: false,
  passwordVerify: false,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
  },
  paper: {
    margin: theme.spacing(8, 4),
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.success.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  email: {},
  password: {
    borderRadius: '5px',
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [labels, setLabels] = useState(defaultLabels);
  const [isFieldError, setIsFieldError] = useState(initialIsFieldError);

  const onShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onShowPasswordVerify = () => {
    setShowPasswordVerify(!showPasswordVerify);
  };

  const onUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setIsFieldError({
      ...isFieldError,
      passwordVerify: false,
      password: false,
    });
    setLabels(defaultLabels);

    setPassword(e.target.value);
  };

  const onPasswordVerifyChange = (e) => {
    setIsFieldError({
      ...isFieldError,
      passwordVerify: false,
      password: false,
    });
    setLabels(defaultLabels);

    setPasswordVerify(e.target.value);
  };

  const fieldsVerification = (password, passwordVerify) => {
    if (password.length < 8) {
      setLabels({
        ...labels,
        password: defaultErrorLabels.passwordMinLength,
      });

      setIsFieldError({ ...isFieldError, password: true });

      return false;
    }

    if (password !== passwordVerify) {
      setLabels({
        ...labels,
        password: defaultErrorLabels.passwordsMustMatch,
      });

      setIsFieldError({
        ...isFieldError,
        password: true,
        passwordVerify: true,
      });

      return false;
    }

    return true;
  };

  const onSignUp = (e) => {
    e.preventDefault();
    if (!fieldsVerification(password, passwordVerify)) return;

    registerUser();
  };

  return (
    <Grid container component="main" className={classes.root}>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          To access the site, please register
        </Typography>
        <form className={classes.form} onSubmit={onSignUp} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="userName"
            label={labels.userName}
            name="userName"
            autoComplete="username"
            autoFocus
            value={userName}
            onChange={onUserNameChange}
            error={isFieldError.userName}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label={labels.email}
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={onEmailChange}
            error={isFieldError.email}
          />
          <FormControl
            className={classes.password}
            style={{ marginTop: '10px' }}
            variant="outlined"
            fullWidth
            error={isFieldError.password}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              {labels.password}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={password}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              onChange={onPasswordChange}
              label={labels.password}
            />
          </FormControl>
          <FormControl
            className={classes.password}
            variant="outlined"
            fullWidth
            error={isFieldError.passwordVerify}
            margin="normal"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              {labels.passwordVerify}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={passwordVerify}
              type={showPasswordVerify ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onShowPasswordVerify}
                    edge="end"
                  >
                    {showPasswordVerify ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              onChange={onPasswordVerifyChange}
              label={labels.passwordVerify}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign up
          </Button>
          <Grid container justifyContent="space-around">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
          <Box mt={5}></Box>
        </form>
      </div>
    </Grid>
  );
};

export default SignUp;
