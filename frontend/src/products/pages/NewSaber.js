import React, { useContext, useEffect, useState } from 'react';
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

import Button from '@material-ui/core/Button';

import './NewSaber.css';

const NewSaber = () => {
  const auth = useContext(AuthContext);
  const [selectedValue, setSelectedValue] = useState();
  const [colors, setColors] = useState();
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

      console.log('save new saber', formState.inputs.available.value);

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/saber',
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      history.push(`/`);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
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
         type="submit"
          variant='contained'
          color='secondary'
          disabled={!formState.isValid}
        >
          ADD SABER
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewSaber;
