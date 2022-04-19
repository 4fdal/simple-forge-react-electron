import React from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  Router,
} from "react-router-dom";
import MainLayout from "../layout/main-layout";
import MinimalLayout from "../layout/minimal-layout";
import LoginPage from "../page/auth/login-page";
import HomePage from "../page/home/home-page";
import LicensePage from "../page/license/license-page";
import SplashscreenPage from "../page/splashscreen/splashscreen-page";
import {
  KEY_ACCESS_TOKEN,
  KEY_LICENSE,
  KEY_USER,
} from "../utils/constants/call-key-storage";

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

class Routers extends React.Component {
  hasAuthenticate = () => {
    let access_token = localStorage.getItem(KEY_ACCESS_TOKEN);
    let user = localStorage.getItem(KEY_USER);

    return (
      ![undefined, null, ""].includes(access_token) &&
      ![undefined, null, ""].includes(user)
    );
  };

  hasLicense = () => {
    let license = localStorage.getItem(KEY_LICENSE);

    return ![undefined, null, ""].includes(license);
  };

  render = () => {
    return (
      <Routes>
        {/* splashscreen */}
        <Route path="/" index element={<SplashscreenPage {...this.props} />} />

        {this.hasAuthenticate() && this.hasLicense() && (
          <>
            {/* home */}
            <Route path="/home" element={<MainLayout {...this.props} />}>
              <Route index element={<HomePage {...this.props} />} />
            </Route>
          </>
        )}

        {/* auth */}
        <Route path="/auth" element={<MinimalLayout {...this.props} />}>
          <Route index element={<LoginPage {...this.props} />} />
        </Route>

        {/* license */}
        <Route path="/license" element={<MinimalLayout {...this.props} />}>
          <Route index element={<LicensePage {...this.props} />} />
        </Route>

        <Route path="*" element={<SplashscreenPage {...this.props} />} />
      </Routes>
    );
  };
}

export default withRouter(Routers);
