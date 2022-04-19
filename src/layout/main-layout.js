import React from "react";

import { Outlet } from "react-router-dom";
import MeBottomNavigation from "./partilas/me-bottom-navigation";
import MeHeaderNavigation from "./partilas/me-header-navigation";

class MainLayout extends React.Component {
  render = () => {
    return (
      <>
        <MeHeaderNavigation {...this.props} />
        <Outlet />
        <MeBottomNavigation {...this.props} />
      </>
    );
  };
}

export default MainLayout;
