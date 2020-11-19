import React, { useState, useContext } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  Link,
  Grid,
  Typography,
  Container,
  CircularProgress,
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          age: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          age: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        console.log('login',responseData.force);
        auth.login(responseData.userId, responseData.token,responseData.isAdmin,responseData.force); 
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            name:formState.inputs.name.value,
            age:formState.inputs.age.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        console.log('sign up ol!!',responseData.force);

        auth.login(responseData.userId, responseData.token,responseData.isAdmin,responseData.force);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className='login-background'>
        <Container component='main' maxWidth='xs'>
          <CssBaseline />
          <div className='paper'>
            <div className='header'>
              {isLoading && <CircularProgress color='secondary' />}
              <Avatar className='avatar-lock'>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component='h1' variant='h5'>
                {isLoginMode ? 'Sign in' : 'Sign up'}
              </Typography>
            </div>

            <form noValidate className='form' onSubmit={authSubmitHandler}>
              {!isLoginMode && (
                <Input
                  element='input'
                  required
                  fullWidth
                  id='name'
                  type='text'
                  label='Your Name'
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText='Please enter a name.'
                  onInput={inputHandler}
                />
              )}
              {!isLoginMode && (
                <Input
                  id='age'
                  element='input'
                  required
                  fullWidth
                  type='age'
                  label='Your Age'
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText='Please enter a valid age.'
                  onInput={inputHandler}
                />
              )}
              <Input
                id='email'
                element='input'
                required
                fullWidth
                type='text'
                label='Email Address'
                validators={[VALIDATOR_EMAIL()]}
                errorText='Please enter a valid title.'
                onInput={inputHandler}
              />
              <Input
                id='password'
                element='password'
                required
                fullWidth
                type='password'
                label='Password'
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText='Please enter a valid password, at least 6 characters.'
                onInput={inputHandler}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                disabled={!formState.isValid}
              >
                {isLoginMode ? 'Sign in' : 'Sign up'}
              </Button>
            </form>
            <br />
            <Grid container>
              <Grid item>
                <Link href='#' variant='body2' onClick={switchModeHandler}>
                  {isLoginMode
                    ? "Don't have an account? Sign Up"
                    : 'Already have an account? Sign in'}
                </Link>
              </Grid>
            </Grid>
            <br />
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Auth;
