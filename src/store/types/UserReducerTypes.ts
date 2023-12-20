import { ChatRoomType, USER_ACTIONS, UserType } from "../../types";

export type UserAction = {
  type: USER_ACTIONS;
  user: UserType;
  chatRoom: ChatRoomType;
  users: UserType[];
};

export type UserState = {
  currentUser: UserType;
  currentUserChatRoom: ChatRoomType;
  users: UserType[];
};
