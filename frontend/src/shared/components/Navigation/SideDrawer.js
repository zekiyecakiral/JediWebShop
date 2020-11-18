import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  useTheme,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { AuthContext } from "../../context/auth-context";
import useStyles from "../../styles/material-ui-syles";
import Backdrop from "../UIElements/Backdrop";

const SideDrawer = (props) => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <div className={classes.sectionMobile}>
        {open && <Backdrop onClick={handleDrawerClose} />}
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
      </div>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
                <ChevronRightIcon />
              )}
          </IconButton>
        </div>
        <Divider />

        <List>
          <ListItem key="Homepage">
            <Button
              color="inherit"
              component={NavLink}
              to={{
                pathname: `/`,
              }}
              onClick={handleDrawerClose}
            >
              Home
            </Button>
          </ListItem>


          {auth.isAdmin && (
            <ListItem key="my saber">
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/sabers/new`,
                }}
                onClick={handleDrawerClose}
              >
                New Saber
              </Button>
            </ListItem>
          )}
          {auth.isAdmin && (
            <ListItem>
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/sabers/crystal/new`,
                }}
                onClick={handleDrawerClose}
              >
                New Crystal
              </Button>
            </ListItem>
          )}
          {auth.isLoggedIn && (
            <ListItem>
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/saber/order`,
                }}
                onClick={handleDrawerClose}
            
              >
                   {auth.isAdmin ? 'All Orders' : 'Your Orders' }
              </Button>
            </ListItem>
          )}
        </List>
        <Divider />
      </Drawer>
    </React.Fragment>
  );
};

export default SideDrawer;
