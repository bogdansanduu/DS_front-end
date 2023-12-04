import React from "react";
import { ROLE } from "../../constants";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../types";

interface UserRouteProps {
  children: JSX.Element;
  role: ROLE;
}
const RoleRestrictedRoute = ({ children, role }: UserRouteProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const currentUserRoles = currentUser.roles.map((role) => role.name);

  const userHasRequiredRole = currentUser && currentUserRoles.includes(role);

  if (!userHasRequiredRole) {
    return <Navigate to={"/access_denied"} replace={true} />;
  }

  return children;
};

export default RoleRestrictedRoute;
