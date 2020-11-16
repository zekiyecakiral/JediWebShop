import React from 'react';
import {NavLink} from 'react-router-dom'
import {Card,CardContent,Button,Typography} from "@material-ui/core";
import SaberItem from './SaberItem';

import './SaberList.css';

const SaberList = props => {

  if (props.items.length === 0) {
    return (
      <div className="user-place-list">
        <Card>
        <CardContent>
        <Typography>No sabers found. Maybe create one?</Typography>
        </CardContent>
        <Button variant="contained" color="secondary"
             component={NavLink}
            to={{
              pathname: "/sabers/new",
            }}
        >New Saber</Button>
       
        </Card>
      </div>
    );
  }


  return (
    <ul className="user-place-list">
      {props.items.map(saber => (
        <SaberItem
          key={saber.id}
          id={saber.id}
          image={saber.image}
          name={saber.name}
          saberId={saber.saberId}
          available={saber.available}
          crystal={saber.crystal}
          onDelete={props.onDeleteSaber}
        />
      ))}
    </ul>
  );
};

export default SaberList;
