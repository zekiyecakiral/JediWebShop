import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '@material-ui/core/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';

import { Typography } from '@material-ui/core';

import './UpdateUser.css';

const UpdateUser = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  const userId = useParams().userId;
  const [successModal, setSuccessModal] = useState(false);
  const [userUpdate,setUserUpdate]=useState(false);

  const closeModal = () => {
    setSuccessModal(false);
  };

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      age: {
        value: '',
        isValid: false,
      },
      force: {
        value: '',
        isValid: false,
      },
      token:{
        value: '',
        isValid: false,
      }
    },
    false
  );

  useEffect(() => {

    console.log('update user');
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/loginUser`,
          'GET',null,

          {
            Authorization: 'Bearer ' + auth.token,
          }
        );
        console.log('loaded user',responseData);
        setLoadedUser(responseData);
        setFormData(
          {
            name: {
              value: responseData.user.name,
              isValid: true,
            },
            age: {
              value: responseData.user.age,
              isValid: true,
            },
            force: {
              value: responseData.user.force,
              isValid: true,
            },
          },
          true
        );

      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId, userUpdate]);

  const userUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users`,
        'PATCH',
        JSON.stringify({
          name: formState.inputs.name.value,
          age:formState.inputs.age.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      console.log(responseData.user);

      setLoadedUser(responseData);

      setSuccessModal(true);
      setUserUpdate((prev) => !prev);

      auth.force = responseData.user.force;

    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={successModal}
        onCancel={closeModal}
        header='Success'
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={
          <Button variant='contained' color='secondary' onClick={closeModal}>
            CLOSE
          </Button>
        }
      >
        <div>
          <p className='success'>Your profile is updated</p>
        </div>
      </Modal>
      {!isLoading && loadedUser && (
        <div className='container-edit-profile'>
          <div className='user-container-profile'>
            <form
              noValidate
              autoComplete='off'
              onSubmit={userUpdateSubmitHandler}
            >
              <Typography variant='body2' color='textSecondary' component='p'>
               You are {loadedUser.degree}
              </Typography>

              <Input
                   id='token'
                   element='input'
                   type='text'
                   label='Your token'
                   fullWidth
                   disabled
                   onInput={inputHandler}
                   initialValue= {auth.token}
                   initialValid={true}
                 />

              {!auth.isAdmin && (
                   <Input
                   id='name'
                   element='input'
                   type='text'
                   label='Your Force'
                   fullWidth
                   disabled
                   onInput={inputHandler}
                   initialValue=  {`${loadedUser.user.force}(F)`}
                   initialValid={true}
                 />
              )}

              <Input
                id='name'
                element='input'
                type='text'
                label='Name'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid title.'
                fullWidth
                onInput={inputHandler}
                initialValue={loadedUser.user.name}
                initialValid={true}
              />

              <Input
                id='age'
                element='input'
                type='text'
                label='Age'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid age.'
                onInput={inputHandler}
                initialValue={loadedUser.user.age}
                initialValid={true}
                fullWidth
              />
              <div className='user-button'>
                <Button
                  type='submit'
                  variant='contained'
                  color='secondary'
                  disabled={!formState.isValid}
                >
                  SAVE CHANGES
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdateUser;
