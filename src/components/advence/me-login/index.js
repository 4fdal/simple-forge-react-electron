/* eslint-disable jsx-a11y/alt-text */
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";

import {
  formValidateDefaultHandle,
  formValidateErrorHandle,
  meToast,
  onChangeHandle,
} from "../../../utils/helpers/call-helper";
import RequestShift from "../../../utils/requests/shift";
import RequestAuth from "../../../utils/requests/auth";
import RequestUser from "../../../utils/requests/user";
import { blue } from "@mui/material/colors";
import appConfig from "../../../app.config";
import { KEY_ADMINISTRATOR_LEVEL } from "../../../utils/constants/call-key-role"

export default class MeLogin extends React.Component {
  state = {
    shifts: [],
    shiftSelected: 0,
    usernameSelected: 0,
    users: [],
    role_id: null,
    role_level: null,
    username: "",
    password: "",
    formValidate: {
      username: [],
      password: [],
    },
  };

  // request get shifts
  handleRequestShifts = () => {
    return RequestShift.getPublicShifts().then((shifts) => {
      this.setState({ shifts });
    });
  };

  // request get user
  handleRequestUsers = () => {
    return RequestUser.getPublicUsers().then((users) => {
      // shifts
      let shifts = this.state.shifts;

      // add super admin account
      const { name, username, role } = appConfig.accounts.superAdmin;
      users.push({ name, username, role });

      // get user
      const user = users[0];

      this.setState({
        users,
        role_id: user?.role_id,
        role_level: user?.role?.level,
        username: user?.username,
        shifts,
      });
    });
  };

  getShifts = () => {
    let shifts = this.state.shifts ?? [];

    if (
      [
        KEY_ADMINISTRATOR_LEVEL,
        appConfig.accounts.superAdmin.role.level,
      ].includes(this.state.role_level)
    ) {
      shifts = [
        {
          id: null,
          name: "Semua Shift",
          start_time: null,
          end_time: null,
          created_at: null,
          updated_at: null,
        },
        ...shifts,
      ];
    }

    return shifts;
  };

  componentDidMount = () => {
    // call request get shifts
    this.handleRequestShifts().then(() => {
      // call request get users
      this.handleRequestUsers();
    });
  };

  onSubmit = (e) => {
    formValidateDefaultHandle(this);
    e.preventDefault();

    const { username, password, shifts, shiftSelected } = this.state;
    const shift = shifts[shiftSelected];

    return RequestAuth.login({ username, password, shift })
      .then((response) => {
        meToast("success", "Login Success");

        // redirect to home
        this.props.router.navigate("/home");
      })
      .catch((err) =>
        err.handle((response) => {
          formValidateErrorHandle(this, response);
        })
      );
  };

  onChangeUsername = ({ target: { value: usernameSelected } }) => {
    let shifts = this.state.shifts;
    const user = this.state.users[usernameSelected];

    this.setState({
      shifts,
      usernameSelected,
      username: user.username,
      role_id: user.role_id,
      role_level: user?.role?.level,
    });
  };

  render = () => {
    return (
      <Grid
        container
        component={"form"}
        onSubmit={this.onSubmit}
        flexDirection={"column"}
        spacing={1.5}
      >
        <Grid item my={3}>
          <Grid container justifyContent={"center"}>
            <img width={"50%"} src="static://images/logo.png" />
          </Grid>
        </Grid>
        <Grid item>
          <FormControl variant="filled" size="small" fullWidth>
            <InputLabel>Name</InputLabel>
            <Select
              value={this.state.usernameSelected}
              onChange={this.onChangeUsername}
              label="Name"
            >
              {this.state.users.map((user, index) => {
                return (
                  <MenuItem key={index} value={index}>
                    {user.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            size="small"
            fullWidth
            value={this.state.username}
            disabled={true}
            id="outlined-basic"
            label="Username"
            variant="filled"
            error={this.state.formValidate.username.length > 0}
            helperText={this.state.formValidate.username.join(", ")}
          />
        </Grid>
        <Grid item>
          <TextField
            size="small"
            fullWidth
            onChange={onChangeHandle(this, "password")}
            type="password"
            id="outlined-basic"
            label="Password"
            variant="filled"
            error={this.state.formValidate.password.length > 0}
            helperText={this.state.formValidate.password.join(", ")}
          />
        </Grid>
        <Grid item>
          <FormControl variant="filled" size="small" fullWidth>
            <InputLabel>Shift</InputLabel>
            <Select
              onChange={onChangeHandle(this, "shiftSelected")}
              value={this.state.shiftSelected}
              label="Shift"
            >
              {this.getShifts().map((shift, index) => {
                return (
                  <MenuItem key={index} value={index}>
                    {shift.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item mt={2}>
          <Button
            type="submit"
            sx={{ backgroundColor: blue[900] }}
            variant="contained"
            fullWidth
          >
            Login
          </Button>
        </Grid>
      </Grid>
    );
  };
}
