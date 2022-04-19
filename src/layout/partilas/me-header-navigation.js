import { AccountCircle, Cloud, Speed } from "@mui/icons-material";
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { blue, grey, yellow } from "@mui/material/colors";
import React from "react";
import moment from "moment";
import appContext from "../../contexts/app-context";
import appConfig from "../../app.config";
import SettingsStorage from "../../utils/storages/settings-storage";
import RequestConnection from "../../utils/requests/connection";
import { KEY_SHIFT, KEY_USER } from "../../utils/constants/call-key-storage";

export default class MeHeaderNavigation extends React.Component {
  static contextType = appContext;

  state = {
    dataTimeNow: moment(Date()).format("DD-MM-YYYY HH:mm"),
    isServerConnected: false,
    isScalesConnected: false,
    shift: JSON.parse(localStorage.getItem(KEY_SHIFT)),
    user: JSON.parse(localStorage.getItem(KEY_USER)),
  };

  componentDidMount = () => {
    // date time interval
    setInterval(() => {
      this.setState({ dataTimeNow: moment(Date()).format("DD-MM-YYYY HH:mm") });
    }, 60 * 1000);
  };

  // get status connection user with context
  getStatusConnection = () => {
    let result = {
      server: this.context.state.isServerConnected,
      scales: this.context.state.isScalesConnected,
    };

    return result;
  };

  getScalesName = () => {
    // todo scales name return
    const application = SettingsStorage.getSettingApplication();
    return application.id_application;
  };

  render = () => {
    const connectionStatus = this.getStatusConnection();

    return (
      <AppBar position="static" color="default">
        <Toolbar variant="dense">
          <Grid
            container
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item>
              <Grid container alignItems={"center"} spacing={2}>
                <Grid item>
                  <Typography variant="caption" color={blue[800]} fontSize={13}>
                    {this.state.dataTimeNow}
                  </Typography>
                </Grid>
                <Grid item>
                  {this.getScalesName() && (
                    <Paper
                      sx={{
                        borderRadius: 2,
                        paddingY: 0.5,
                        paddingX: 1,
                        backgroundColor: yellow[700],
                      }}
                    >
                      <Typography fontSize={10}>
                        {this.getScalesName()}
                      </Typography>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                <IconButton
                  color={connectionStatus.scales ? "primary" : "default"}
                  size="small"
                  sx={{
                    backgroundColor: connectionStatus.scales
                      ? blue[200]
                      : grey[400],
                    marginX: 0.5,
                  }}
                >
                  <Speed fontSize="small" />
                </IconButton>
                <Typography fontWeight={"bold"} fontSize={10}>
                  {connectionStatus.scales ? "CONNECTED" : "DISCONNECTED"}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                <IconButton
                  color={connectionStatus.server ? "primary" : "default"}
                  size="small"
                  sx={{
                    marginX: 0.5,
                    backgroundColor: connectionStatus.server
                      ? blue[200]
                      : grey[400],
                  }}
                >
                  <Cloud fontSize="small" />
                </IconButton>
                <Typography fontWeight={"bold"} fontSize={10}>
                  {connectionStatus.server ? "CONNECTED" : "DISCONNECTED"}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                flexDirection={"row"}
                alignItems={"center"}
                spacing={1}
              >
                <Grid item>
                  {this.state?.shift?.name && (
                    <Paper
                      sx={{
                        paddingX: 1.5,
                        paddingY: 0.5,
                        borderRadius: 2,
                        backgroundColor: blue[900],
                      }}
                    >
                      <Typography fontSize={10} color={"white"}>
                        {this.state?.shift?.name}
                      </Typography>
                    </Paper>
                  )}
                </Grid>
                <Grid item>
                  {this.state?.user?.name && (
                    <Button
                      color="inherit"
                      sx={{
                        fontSize: 10,
                      }}
                      style={{ textTransform: "capitalize" }}
                      startIcon={<AccountCircle />}
                    >
                      {this.state?.user?.name}
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  <Typography color={"gray"} fontSize={10}>
                    v{appConfig.applicationInformation.version}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  };
}
