import React, { useReducer, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
    });
  };

  let element = '';
  if (props.element === 'input') {
    element = (
      <TextField
        error={!inputState.isValid && inputState.isTouched ? true : false}
        required={props.required ? true: false}
        fullWidth={props.fullWidth ? true : false}
        disabled={props.disabled ? true : false}
        id='outlined-basic'
        label={props.label}
        variant='outlined'
        defaultValue={props.initialValue}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        helperText={
          !inputState.isValid && inputState.isTouched ? props.errorText : ''
        }
      />
    );
  } else if (props.element === 'password') {
    element = (
      <TextField
      error={!inputState.isValid && inputState.isTouched ? true : false}
      variant='outlined'
      margin='normal'
      element='password'
      required
      fullWidth
      name='password'
      label= {props.label}
      type='password'
      id='password'
      autoComplete='current-password'
      onChange={changeHandler}
      onBlur={touchHandler}
      helperText={
        !inputState.isValid && inputState.isTouched ? props.errorText : ''
      }
    />
    );
  } else {
    element = (
      <TextField
      error={!inputState.isValid && inputState.isTouched ? true : false}
        id='outlined-multiline-flexible'
        label={props.label}
        required={props.required ? true: false}
        fullWidth={props.fullWidth ? true : false}
        disabled={props.disabled ? true : false}
        multiline
        rowsMax={4}
        onChange={changeHandler}
        defaultValue={props.initialValue}
        variant='outlined'
        onBlur={touchHandler}
        helperText={
          !inputState.isValid && inputState.isTouched ? props.errorText : ''
        }
      />
    );
  }

  return <div className='form-control'>{element}</div>;

};

export default Input;
