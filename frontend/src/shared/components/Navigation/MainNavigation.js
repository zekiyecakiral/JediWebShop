import React, { useState, useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import useStyles from '../../styles/material-ui-syles';
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  MenuItem,
  Menu,
} from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import { AuthContext } from '../../context/auth-context';
import SideDrawer from './SideDrawer';

import './MainNavigation.css';

const MainNavigation = (props) => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [isLogin, setIsLogin] = useState(true);
  const history = useHistory();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logout = () => {
    setIsLogin(false);
    auth.logout();
    history.push('/');
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={handleMenuClose}
        component={NavLink}
        to={{
          pathname: `/user/${auth.userId}`,
        }}
      >
        Update Profile
      </MenuItem>

      <MenuItem onClick={logout}>Log Out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {auth.isLoggedIn && (
        <div>
          <MenuItem
            onClick={handleMenuClose}
            component={NavLink}
            to={{
              pathname: `/user/${auth.userId}`,
            }}
          >
            Update Profile
          </MenuItem>
          <MenuItem onClick={logout}>Log Out</MenuItem>
        </div>
      )}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position='static'>
        <Toolbar>
          <SideDrawer />
          <Button
            color='inherit'
            component={NavLink}
            to={{
              pathname: `/`,
            }}
          >
            <Typography className={classes.title} variant='h6' noWrap>
              JEDI Web Shop
            </Typography>
          </Button>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {auth.isLoggedIn && auth.isAdmin && (
              <Button
                color='inherit'
                component={NavLink}
                to={{
                  pathname: `/calculate`,
                }}
              >
                Calculate
              </Button>
            )}

            {auth.isLoggedIn && (
              <Button
                color='inherit'
                component={NavLink}
                to={{
                  pathname: `/saber/order`,
                }}
              >
                {auth.isAdmin ? 'All Orders' : 'Your Orders'}
              </Button>
            )}

            {auth.isLoggedIn && auth.isAdmin && (
              <Button
                color='inherit'
                component={NavLink}
                to={{
                  pathname: `/sabers/new`,
                }}
              >
                NEW SABER
              </Button>
            )}
            {auth.isLoggedIn && auth.isAdmin && (
              <Button
                color='inherit'
                component={NavLink}
                to={{
                  pathname: `/sabers/crystal/new`,
                }}
              >
                NEW CRYSTAL
              </Button>
            )}

            {!auth.isLoggedIn && (
              <Button
                color='inherit'
                component={NavLink}
                to={{
                  pathname: `/auth`,
                }}
                title='LOGIN'
              >
                Login
              </Button>
            )}
            {auth.isLoggedIn && (
              <React.Fragment>
                <div className={classes.root}>
                  <Avatar
                    alt='profile'
                    src="asdf"
                    aria-controls={menuId}
                    onClick={handleProfileMenuOpen}
                    className={classes.large}
                  />
                </div>
              </React.Fragment>
            )}
          </div>
          <div className={classes.sectionMobile}>
            {auth.isLoggedIn && (
              <IconButton
                aria-label='show more'
                aria-controls={mobileMenuId}
                aria-haspopup='true'
                onClick={handleMobileMenuOpen}
                color='inherit'
              >
                <MoreIcon />
              </IconButton>
            )}

            {!auth.isLoggedIn && (
              <Button
                color='inherit'
                component={NavLink}
                to={{
                  pathname: `/auth`,
                }}
              >
                Login
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {isLogin && renderMenu}
    </div>
  );
};

export default MainNavigation;
