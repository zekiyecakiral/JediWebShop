import React, { useContext } from 'react';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_NUMBER,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import Button from '@material-ui/core/Button';

import './NewSaber.css';

const NewCrystal = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      color: {
        value: '',
        isValid: false,
      },
      name: {
        value: '',
        isValid: false,
      },
      planet: {
        value: '',
        isValid: false,
      },
      forcePercentage: {
        value: '',
        isValid: false,
      },
      harvestedAmount: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const crystalSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/crystal',
        'POST',
        JSON.stringify({
          color: formState.inputs.color.value,
          name: formState.inputs.name.value,
          forcePercentage: formState.inputs.forcePercentage.value,
          harvestedAmount: formState.inputs.harvestedAmount.value,
          planet: formState.inputs.planet.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className='place-form' onSubmit={crystalSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}

        <Input
          id='name'
          element='textarea'
          label='Name'
          fullWidth
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid name.'
          onInput={inputHandler}
        />
        <Input
          id='color'
          element='input'
          type='text'
          label='Color'
          fullWidth
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid color.'
          onInput={inputHandler}
        />
        <Input
          id='planet'
          element='input'
          type='text'
          label='Planet'
          fullWidth
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid planet.'
          onInput={inputHandler}
        />
        <Input
          id='forcePercentage'
          element='number'
          label='Force Percentage (%F)'
          fullWidth
          validators={[VALIDATOR_NUMBER()]}
          errorText='Please enter a valid number.'
          onInput={inputHandler}
        />
        <Input
          id='harvestedAmount'
          element='number'
          label='Harversted Amount (Cr)'
          fullWidth
          validators={[VALIDATOR_NUMBER()]}
          errorText='Please enter a valid number.'
          onInput={inputHandler}
        />
        <Button
        type="submit"
          variant='contained'
          color='secondary'
          disabled={!formState.isValid}
        >
          ADD NEW CRYSTAL
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewCrystal;
