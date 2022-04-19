/* eslint-disable jsx-a11y/alt-text */
import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import {
  formValidateDefaultHandle,
  meToast,
  onChangeHandle,
} from "../../../utils/helpers/call-helper";
import RequestAuth from "../../../utils/requests/auth";
import RequestLicense from "../../../utils/requests/license";

export default class MeLicense extends React.Component {
  state = {
    license: "",
    formValidate: {
      license: [],
    },
  };

  componentDidMount = () => {};

  onSubmit = (e) => {
    formValidateDefaultHandle(this);
    e.preventDefault();

    const { license } = this.state;

    return RequestLicense.insertLicense(license)
      .then((response) => {
        return RequestAuth.check(this.props.router)
          .then(() => {
            this.props.router.navigate("/home");
            console.log("login");
          })
          .catch((err) => {
            console.log("not login", this.props.router);
            this.props.router.navigate("/auth");
          });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data) {
            let { message } = err.response.data;

            meToast("error", message);
          }
        }
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
        <Grid item my={1}>
          <Grid container justifyContent={"center"}>
            <img src="static://images/logo.png" />
          </Grid>
        </Grid>
        <Grid item>
          <TextField
            size="small"
            fullWidth
            value={this.state.license}
            id="outlined-basic"
            label="License Key"
            variant="filled"
            onChange={onChangeHandle(this, "license")}
            error={this.state.formValidate.license.length > 0}
            helperText={this.state.formValidate.license.join(", ")}
          />
        </Grid>

        <Grid item>
          <Button type="submit" variant="contained" fullWidth>
            Active
          </Button>
        </Grid>
      </Grid>
    );
  };
}
