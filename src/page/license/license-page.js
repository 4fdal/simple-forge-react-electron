import { Grid, Paper } from "@mui/material";
import React from "react";
import MeLicense from "../../components/advence/me-license";

export default class LicensePage extends React.Component {
  render = () => {
    return (
      <Grid container justifyContent={"center"}>
        <Grid item>
          <Paper
            sx={{
              width: 300,
              marginTop: 10,
              marginTop: "50%",
              padding: 2,
              borderRadius: 2,
            }}
          >
            <MeLicense {...this.props} />
          </Paper>
        </Grid>
      </Grid>
    );
  };
}
