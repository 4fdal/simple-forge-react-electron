import { Grid } from "@mui/material";
import React from "react";
import appContext from "../../contexts/app-context";

class HomePage extends React.Component {
  static contextType = appContext;
  render = () => {
    return (
      <Grid p={1.5} flexDirection={"column"}>
        <h1>Hello World</h1>
      </Grid>
    );
  };
}

export default HomePage;
