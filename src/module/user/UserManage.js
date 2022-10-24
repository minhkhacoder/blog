/** @format */

import DashboardHeading from "module/dashboard/DashboardHeading";
import React from "react";
import { NavLink } from "react-router-dom";
import UserTable from "./UserTable";

const UserManage = () => {
  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
      <div className="flex items-end justify-end p-4 mb-3 gap-x-5">
        <span className="text-xl">Create user</span>
        <NavLink to="/manage/add-user">
          <div className="p-2 text-white rounded-md cursor-pointer bg-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v18m9-9H3"
              />
            </svg>
          </div>
        </NavLink>
      </div>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
