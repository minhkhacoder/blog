/** @format */

import React, { Fragment } from "react";
import Header from "./Header";
import PropTypes from "prop-types";

const Layout = ({ children }) => {
  return (
    <Fragment>
      <Header></Header>
      {children}
    </Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.any,
};

export default Layout;
