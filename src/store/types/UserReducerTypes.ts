import { USER_ACTIONS, UserType } from "../../types";

export type UserAction = {
  type: USER_ACTIONS;
  user: UserType;
  users: UserType[];
};

export type UserState = {
  currentUser: UserType;
  users: UserType[];
};
