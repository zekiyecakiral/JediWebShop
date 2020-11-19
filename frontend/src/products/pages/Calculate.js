import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '../../shared/components/FormElements/Input';
import FileUpload from '../components/FileUpload';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_NUMBER,
  VALIDATOR_MIN,
} from '../../shared/util/validators';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import './Calculate.css';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 500,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 18,
  },
  pos: {
    marginBottom: 12,
  },
});

const Calculate = () => {
  const classes = useStyles();
  const [readData, setReadData] = useState();
  const [selectedSaber, setSelectedSaber] = useState();
  const [result, setResult] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      age: {
        value: '',
        isValid: false,
      },
      saber: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const calculateSubmitHandler = async (event) => {
    event.preventDefault();

    console.log('readData', readData);

    const filteredSaber = readData.saber.find(
      (item) =>
        item.id === formState.inputs.saber.value ||
        item.name.toUpperCase() === formState.inputs.saber.value.toUpperCase()
    );

    if (!filteredSaber) {
      handleClickOpen();
    }
    setSelectedSaber(filteredSaber);

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/calculate',
        'POST',
        JSON.stringify({
          age: formState.inputs.age.value,
          color: filteredSaber.crystal.color,
          crystalName: filteredSaber.crystal.name,
        }),
        {
          'Content-Type': 'application/json',
        }
      );
      console.log('hesap', responseData.result);
      setResult(responseData.result);
    } catch (err) {}
  };

  const readFile = (datas) => {
    setReadData(datas.sabers);
    console.log('calcualte read file func', datas.sabers);
  };

  return (
    <div>
      <ErrorModal error={error} onClear={clearError} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Error'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Please enter valid saber id or name!!!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <div className='price-info'>
        <Card>
          <CardContent>
            <FileUpload readFile={readFile} />
          </CardContent>
        </Card>
      </div>
      <div className='price-info'>
        {readData && (
          <Card>
            <CardContent>
              <form onSubmit={calculateSubmitHandler}>
                <Input
                  id='age'
                  element='textarea'
                  label='Age'
                  validators={[VALIDATOR_NUMBER(), VALIDATOR_MIN(1)]}
                  errorText='Please enter a valid age.'
                  onInput={inputHandler}
                />
                <Input
                  id='saber'
                  element='number'
                  label='Id or name'
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText='Please enter a valid id or saber name'
                  onInput={inputHandler}
                />
                <Button
                  type='submit'
                  variant='contained'
                  color='secondary'
                  disabled={!formState.isValid}
                >
                  CALCULATE PRICE
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        {result && (
          <Card>
            <CardContent>
              <Typography color='textSecondary' gutterBottom>
                Result
              </Typography>
              {result.degree && result.degree === 'Jedi [no-power]' ? (
                <Typography component='p' gutterBottom>
                  You cannot allow to buy a saber light. We suggest you go to
                  holiday!
                </Typography>
              ) : result.price == 0 ? (
                <Typography component='p' gutterBottom>
                  You cannot allow to buy a saber light!
                </Typography>
              ) : (
                <>
                  <Typography component='p' gutterBottom>
                    F = {result.force}
                  </Typography>
                  <Typography variant='h5' component='h4'>
                    Jedi power usage:
                  </Typography>
                  <Typography component='p' color='textSecondary'>
                    F needed = {result.powerUsage}F
                  </Typography>
                  <Typography variant='h5' component='h4'>
                    Crystal detail:
                  </Typography>
                  <Typography component='p' color='textSecondary'>
                    Crystal type: {result.crystalType}
                  </Typography>
                  <Typography component='p' gutterBottom>
                    Price : $$ {result.price}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <div className='data-container'>
        {readData &&
          readData.saber.map((item) => (
            <Card className={classes.root} key={item.id}>
              <CardContent>
                <Typography color='textSecondary' component='p' gutterBottom>
                  ID : {item.id}
                </Typography>
                <Typography color='textSecondary' component='p' gutterBottom>
                  Name : {item.name}
                </Typography>
                <Typography color='textSecondary' component='p' gutterBottom>
                  Available : {item.available}
                </Typography>

                <Typography color='textSecondary' component='p' gutterBottom>
                  Name : {item.crystal.name}
                </Typography>
                <Typography color='textSecondary' component='p' gutterBottom>
                  Color : {item.crystal.color}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Calculate;
