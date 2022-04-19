import {
  Dialog,
  DialogContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import React from "react";

export default class Loader extends React.Component {
  static defaultProps = {
    open: false,
  };

  render = () => {
    return (
      <Dialog open={this.props.open}>
        <DialogContent sx={{ width: 200 }}>
          <Typography variant="caption">Waiting...</Typography>
          <LinearProgress />
        </DialogContent>
      </Dialog>
    );
  };
}
