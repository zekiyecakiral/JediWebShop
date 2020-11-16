import React, { useState, useContext } from 'react';
import {  NavLink,useHistory } from 'react-router-dom';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useCalculate } from '../../shared/hooks/calculate-hook';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import {
  Card,
  Button,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from '@material-ui/core';

import './ProductItem.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 350,
  },
  media: {
    height: 420,
    paddingTop: '56.25%',
  },
  avatar: {
    backgroundColor: red[500],
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const SaberItem = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

 const {price}=useCalculate(props.crystal.harvestedAmount,props.crystal.forcePercentage)

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/saber/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

const orderItem = async () =>{

  try {
    await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/order/saber/${props.id}`,
      'POST',
      JSON.stringify({
        price: price,
      }),
      {
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json'
      }
    );
    history.push(`/saber/order`);
  } catch (err) {}

}


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header='Are you sure?'
        footerClass='place-item__modal-actions'
        footer={
          <React.Fragment>
            <Button
              variant='contained'
              color='primary'
              onClick={cancelDeleteHandler}
            >
              CANCEL
            </Button>
            <Button
              variant='contained'
              color='secondary'
              className={classes.button}
              onClick={confirmDeleteHandler}
            >
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this saber? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      <li className='place-item'>
        <Card className={`${classes.root} place-item-container-place`}>
          <CardMedia
            className={classes.media}
            image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
            title='Paella dish'
          >
            <div className='item-info-part-place'>
              <CardHeader className={classes.root} title={props.name} />

              <CardContent>
                <Typography variant='body2' color='textSecondary' component='p'>
                  Crystal Name: {props.crystal.name}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  Crystal Color: {props.crystal.color}
                </Typography>
                {!auth.isAdmin && 
                   <Typography variant='body2' gutterBottom>
                   Price : $$ {price}
                 </Typography>
                }
             
              </CardContent>
              <CardActions>
                {auth.isAdmin && (
                  <Button
                    variant='contained'
                    color='primary'
                    component={NavLink}
                    to={{
                      pathname: `/sabers/${props.id}`,
                    }}
                  >
                    EDIT
                  </Button>
                )}
                {auth.isAdmin && (
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={showDeleteWarningHandler}
                    className={classes.button}
                  
                  >
                    DELETE
                  </Button>
                )}
                {!auth.isAdmin && 
                  (<Button
                    variant='contained'
                    color='secondary'
                    onClick={orderItem}
                    className={classes.button}
                  >
                    Order
                  </Button>)}
              </CardActions>
            </div>
          </CardMedia>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default SaberItem;
