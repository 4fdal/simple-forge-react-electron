import React from "react";
import { withRouter } from "../../router";
import RequestAuth from "../../utils/requests/auth";
import RequestLicense from "../../utils/requests/license";

class SplashscreenPage extends React.Component {
  state = {
    isLoading: true,
  };

  componentDidMount = () => {
    // check license and authenticate
    RequestLicense.check()
      .then(response => {
        RequestAuth.check()
          .then(() => {
            this.props.router.navigate("/home");
          })
          .catch(() => {
            this.props.router.navigate("/auth");
          });
      })
      .catch(() => {
        this.props.router.navigate("/license");
      });
  };

  render = () => {
    return <></>;
  };
}

export default withRouter(SplashscreenPage);
