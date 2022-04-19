import React from "react";
import { ToastContainer } from "react-toastify";
import AppContext from "./contexts/app-context";
import Routers from "./router/index";

import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/base/loader";
import { handleIpcRenderer } from "./utils/ipc-renderer";
import SettingsStorage from "./utils/storages/settings-storage";
import RequestConnection from "./utils/requests/connection";
import appConfig from "./app.config";

class App extends React.Component {
  state = {
    isLoader: false,
    gross: 0.0,
    netto: 0.0,
    tare: 0.0,
    hasClickTareButton: false,
    hasClickZeroButton: false,
    isServerConnected: false,
    isScalesConnected: false,
  };

  // set loaded with context
  setLoader = (isLoader = true) => this.setState({ isLoader });

  // get status loaded with context
  getLoader = () => this.state.isLoader;

  componentDidMount = () => {
    handleIpcRenderer().send("sync.scale", SettingsStorage.getSettingScale());
    handleIpcRenderer().on("sync.scale.reply", async (event, result) => {
      if (result.data) {
        const { wight, unit } = result.data;
        const { hasClickTareButton, hasClickZeroButton } = this.state;
        if (hasClickTareButton) {
          const gross = parseFloat(this.state.gross).toFixed(2);
          const tare = parseFloat(wight).toFixed(2);
          const netto = (gross - tare).toFixed(2);
          this.setState({
            hasClickTareButton: false,
            gross,
            tare,
            netto,
            isScalesConnected: true,
          });
        } else if (hasClickZeroButton) {
          this.setState({
            hasClickZeroButton: false,
            gross: wight,
            isScalesConnected: true,
            netto: 0,
            tare: 0,
          });
        } else {
          this.setState({ gross: wight, isScalesConnected: true });
        }
      } else {
        this.setState({ gross: wight, isScalesConnected: false });
      }
    });

    // check connection interval
    this.handleCheckConnection();
    setInterval(() => {
      this.handleCheckConnection();
    }, appConfig.msIntervalCheckConnection);
  };

  // set interval 15sec
  handleCheckConnection = () => {
    // check server connection
    const { host_server: host, port_server: port } =
      SettingsStorage.getSettingServer();
    RequestConnection.test({ host, port })
      .then(() => {
        this.setState({ isServerConnected: true });
      })
      .catch((err) => {
        if (!err?.response?.status) {
          this.setState({ isServerConnected: false });
        }
      });

    // todo check scales connection ...
  };

  onClickTareButton = () => {
    this.setState({ hasClickTareButton: true });
  };

  onClickZeroButton = () => {
    this.setState({ hasClickZeroButton: true });
  };

  render = () => {
    return (
      <AppContext.Provider value={this}>
        <Loader open={this.getLoader()} />
        <ToastContainer />
        <Routers />
      </AppContext.Provider>
    );
  };
}

export default App;
