import { Grid, Paper } from "@mui/material";
import React from "react";
import MeLogin from "../../components/advence/me-login";

export default class LoginPage extends React.Component {
  render = () => {
    return (
      <Grid container justifyContent={"center"}>
        <Grid item>
          <Paper
            sx={{
              width: 300,
              marginTop: "50%",
              padding: 2,
              borderRadius: 2,
            }}
          >
            <MeLogin {...this.props} />
          </Paper>
        </Grid>
      </Grid>
    );
  };
}
