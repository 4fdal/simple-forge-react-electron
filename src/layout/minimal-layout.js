import React from "react";
import { Outlet } from "react-router-dom";

import MeHeaderNavigation from "./partilas/me-header-navigation";

class MinimalLayout extends React.Component {
  render = () => {
    return (
      <>
        <MeHeaderNavigation {...this.props} />
        <Outlet />
      </>
    );
  };
}

export default MinimalLayout;
