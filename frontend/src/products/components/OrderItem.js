import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../shared/context/auth-context';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(1),
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const OrderItem = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cover}
        image={`${process.env.REACT_APP_ASSET_URL}/${props.saber.image}`}
        title={props.saber.name}
      />

      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography gutterBottom variant='body2' component='p'>
            {props.saber.name}
          </Typography>

          <Typography variant='body2' color='textSecondary' component='p'>
            Crystal Name : {props.crystal.name}
          </Typography>

          <Typography variant='body2' color='textSecondary' component='p'>
            Crystal Color: {props.crystal.color}
          </Typography>

          <Typography variant='body2' color='textSecondary' component='p'>
            Crystal Planet : {props.crystal.planet}
          </Typography>
        </CardContent>
      </div>

      <div className={classes.details}>
        <CardContent className={classes.content}>
          {auth.isAdmin && (
            <Typography variant='body2' color='textSecondary' component='p'>
              Ordered by: {props.user.name}
            </Typography>
          )}

          <Typography variant='body2' color='textSecondary' component='p'>
            Created at: {new Date(props.createdAt).toLocaleString()}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            Price: $$ {props.price}
          </Typography>
        </CardContent>
        <div className={classes.controls}></div>
      </div>
    </Card>
  );
};

export default OrderItem;
