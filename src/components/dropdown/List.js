/** @format */

import React from "react";
import { useDropdown } from "./dropdown-context";
import PropTypes from "prop-types";

const List = ({ children }) => {
  const { show } = useDropdown();
  return (
    <>
      {show && (
        <div className="absolute left-0 w-full bg-white shadow-sm top-full">
          {children}
        </div>
      )}
    </>
  );
};

List.propsTypes = {
  children: PropTypes.any,
};

export default List;
