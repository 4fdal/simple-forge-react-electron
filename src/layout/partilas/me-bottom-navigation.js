/* eslint-disable eqeqeq */
import { Home, Logout } from "@mui/icons-material";
import { AppBar, Button, Grid, Toolbar, Typography } from "@mui/material";
import React from "react";
import appConfig from "../../app.config";
import {
  KEY_ADMINISTRATOR_LEVEL,
  KEY_OPERATOR_LEVEL,
} from "../../utils/constants/call-key-role";
import { KEY_USER } from "../../utils/constants/call-key-storage";
import RequestAuth from "../../utils/requests/auth";
export default class MeBottomNavigation extends React.Component {
  state = {
    menuItems: [
      {
        label: "Home",
        startIcon: <Home />,
        to: "/home",
        allowRoles: [KEY_ADMINISTRATOR_LEVEL, KEY_OPERATOR_LEVEL],
      },
    ],
  };

  componentDidMount = () => {};

  onClickLogout = () => {
    // request call request logout
    RequestAuth.logout(this.props.router);
  };

  onMenuItemClick = (menuItem, index) => () => {
    this.props.router.navigate(menuItem.to);
  };

  isActiveMenuItem = (pathname) => {
    const currentPathname = this.props.router.location.pathname;

    if (currentPathname != "/home" && pathname != "/home") {
      return currentPathname.indexOf(pathname) != -1;
    } else {
      return currentPathname == "/home" && pathname == "/home";
    }
  };

  hasAllowUserRole = (allowRoles = []) => {
    const user = JSON.parse(localStorage.getItem(KEY_USER));

    return (
      allowRoles.includes(user?.role?.level) ||
      user.username == appConfig.accounts.superAdmin.username
    );
  };

  renderMenuItems = (menuItem, index) => {
    return (
      this.hasAllowUserRole(menuItem.allowRoles) && (
        <Grid key={index} item>
          <Button
            variant={this.isActiveMenuItem(menuItem.to) ? "contained" : "text"}
            color={this.isActiveMenuItem(menuItem.to) ? "warning" : "inherit"}
            onClick={this.onMenuItemClick(menuItem, index)}
            size="small"
            sx={{ color: "black" }}
            startIcon={menuItem.startIcon}
          >
            <Typography fontSize={10} textTransform="capitalize">
              {menuItem.label}
            </Typography>
          </Button>
        </Grid>
      )
    );
  };

  render = () => {
    return (
      <AppBar position="fixed" color="default" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar variant="dense">
          <Grid container justifyContent={"space-between"}>
            <Grid item>
              <Grid container spacing={1}>
                {this.state.menuItems.map(this.renderMenuItems)}
              </Grid>
            </Grid>
            <Grid item>
              <Button
                onClick={this.onClickLogout}
                size="small"
                sx={{ fontSize: 10, textTransform: "capitalize" }}
                startIcon={<Logout />}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  };
}
