/** @format */

import React from "react";
import { DropdownProvider } from "./dropdown-context";
import PropTypes from "prop-types";

const Dropdown = ({ children, ...props }) => {
  return (
    <DropdownProvider {...props}>
      <div className="relative inline-block w-full">{children}</div>
    </DropdownProvider>
  );
};

Dropdown.propsTypes = {
  children: PropTypes.any,
};

export default Dropdown;
