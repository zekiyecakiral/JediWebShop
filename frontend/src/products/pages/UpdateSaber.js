import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { Button, Card, CardContent } from '@material-ui/core';
import Modal from '../../shared/components/UIElements/Modal';

// import './NewSaber.css';

const UpdateSaber = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedSaber, setLoadedSaber] = useState();
  const [successModal, setSuccessModal] = useState(false);
  const saberId = useParams().saberId;
 const [saberUpdate,setSaberUpdate]=useState(false);
  const [formState, inputHandler, setFormData] = useForm(
    {
      id: {
        value: '',
        isValid: false,
      },
      name: {
        value: '',
        isValid: false,
      },
      description: {
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

  const closeModal = () => {
    setSuccessModal(false);
  };

  useEffect(() => {
    const fetchSaber = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/saber/${saberId}`
        );

        console.log('updateproduct ', responseData);

        setLoadedSaber(responseData.saber);
        setFormData(
          {
            id: {
              value: responseData.saber.saberId,
              isValid: true,
            },

            name: {
              value: responseData.saber.name,
              isValid: true,
            },
            available: {
              value: responseData.saber.available,
              isValid: true,
            },
            image: {
              value: `${process.env.REACT_APP_ASSET_URL}/${responseData.saber.image}`,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchSaber();
  }, [sendRequest, saberId, setFormData,saberUpdate]);

  const saberUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {

      const formData = new FormData();
      formData.append('id', formState.inputs.id.value);
      formData.append('name', formState.inputs.name.value);
      formData.append('available', formState.inputs.available.value);
      formData.append('image', formState.inputs.image.value);

       const responseData  = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/saber/${saberId}`,
        'PATCH',
       formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      setLoadedSaber(responseData.saber);
      setSaberUpdate((prev) => !prev);
      setSuccessModal(true);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedSaber && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find saber!</h2>
        </Card>
      </div>
    );
  }

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
          <p className='success'>Your saber is updated</p>
        </div>
      </Modal>
      {!isLoading && loadedSaber && (
        <Card >
          <CardContent>
            <form onSubmit={saberUpdateSubmitHandler}>

              <ImageUpload
                id='image'
                onInput={inputHandler}
                errorText='Please provide an image.'
                text="Update Image"
                initialValue={`${process.env.REACT_APP_ASSET_URL}/${loadedSaber.image}`}
              />

                <Input
                id='id'
                element='input'
                type='text'
                label='ID'
                fullWidth
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid name.'
                onInput={inputHandler}
                initialValue={loadedSaber.saberId}
                initialValid={true}
              />

              <Input
                id='name'
                element='input'
                type='text'
                label='Product Name'
                fullWidth
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid name.'
                onInput={inputHandler}
                initialValue={loadedSaber.name}
                initialValid={true}
              />
              <Input
                id='available'
                element='input'
                type='text'
                label='Available'
                fullWidth
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid available.'
                onInput={inputHandler}
                initialValue={loadedSaber.available}
                initialValid={true}
              />

              <div className='button-edit-form'>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  disabled={!formState.isValid}
                >
                  UPDATE SABER
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </React.Fragment>
  );
};

export default UpdateSaber;
