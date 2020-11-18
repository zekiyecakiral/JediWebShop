import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_NUMBER,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import FileUpload from '../components/FileUpload';

import './NewSaber.css';

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

const NewSaber = () => {
  const classes = useStyles();

  const auth = useContext(AuthContext);
  const [selectedValue, setSelectedValue] = useState();
  const [colors, setColors] = useState();
  const [readXmlData, setReadXmlData] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      id: {
        value: '',
        isValid: false,
      },
      name: {
        value: '',
        isValid: false,
      },
      available: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  useEffect(() => {
    const fetchCrystals = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/crystal'
        );
        const result = responseData.crystals.map((crystal) => ({
          value: crystal.id,
          label: `${crystal.name} [${crystal.color}]`,
        }));
        setColors(result);
      } catch (err) {}
    };
    fetchCrystals();
  }, []);

  const handleChange = (e) => {
    setSelectedValue(e.value);
  };

  const saberSubmitHandler = async (event) => {
    event.preventDefault();

    console.log(' new saber');

    try {
      const formData = new FormData();
      formData.append('id', formState.inputs.id.value);
      formData.append('name', formState.inputs.name.value);
      formData.append('available', formState.inputs.available.value);
      formData.append('image', formState.inputs.image.value);
      formData.append('crystalId', selectedValue);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/saber/createItem',
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      history.push(`/`);
    } catch (err) {}
  };

  const saveXmlData = async () => {
    console.log('kaydedeceklerim bunlar', readXmlData);
    const responseSaveXmlData = null;
    try {
      responseSaveXmlData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/saber',
        'POST',
        JSON.stringify({
          sabers: readXmlData,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
    } catch (error) {}

  };

  const readFile = (datas) => {
    setReadXmlData(datas.sabers);
    console.log('calcualte read file func', datas.sabers);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div className='price-info'>
        <Card>
          <CardContent>
            <FileUpload readFile={readFile} />
          </CardContent>
        </Card>
      </div>

      <div className='hr-sect'>or</div>

      <div className='data-container'>
        {readXmlData && (
          <div >
            <Typography variant='h5' component='h5'>
              Preview
            </Typography>

            <div className='saber-item-container'>
              {readXmlData.saber.map((item) => (
                <Card className={classes.root} key={item.id}>
                  <CardContent>
                    <Typography
                      color='textSecondary'
                      component='p'
                      gutterBottom
                    >
                      ID : {item.id}
                    </Typography>
                    <Typography
                      color='textSecondary'
                      component='p'
                      gutterBottom
                    >
                      Name : {item.name}
                    </Typography>
                    <Typography
                      color='textSecondary'
                      component='p'
                      gutterBottom
                    >
                      Available : {item.available}
                    </Typography>

                    <Typography
                      color='textSecondary'
                      component='p'
                      gutterBottom
                    >
                      Name : {item.crystal.name}
                    </Typography>
                    <Typography
                      color='textSecondary'
                      component='p'
                      gutterBottom
                    >
                      Color : {item.crystal.color}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={saveXmlData}
              type='submit'
              variant='contained'
              color='secondary'
            >
              Save all sabers
            </Button>
          </div>
        )}
      </div>
      {!readXmlData && (
        <form className='place-form' onSubmit={saberSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            id='id'
            element='input'
            type='text'
            label='ID'
            fullWidth
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid id.'
            onInput={inputHandler}
          />

          {colors && (
            <Select
              options={colors}
              className='select-product-option'
              value={colors.find((obj) => obj.value === selectedValue)}
              onChange={handleChange}
            />
          )}

          <Input
            id='name'
            element='textarea'
            label='Product Name'
            fullWidth
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid name.'
            onInput={inputHandler}
          />
          <Input
            id='available'
            element='number'
            label='Available'
            fullWidth
            validators={[VALIDATOR_NUMBER()]}
            errorText='Please enter a valid number.'
            onInput={inputHandler}
          />
          <ImageUpload
            id='image'
            onInput={inputHandler}
            errorText='Please provide an image.'
          />
          <Button
            type='submit'
            variant='contained'
            color='secondary'
            disabled={!formState.isValid}
          >
            ADD SABER
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default NewSaber;
