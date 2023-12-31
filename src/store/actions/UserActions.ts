import { ChatRoomType, USER_ACTIONS, UserType } from "../../types";

export const SET_CURRENT_USER = (user: UserType) => {
  return {
    type: USER_ACTIONS.SET_CURRENT_USER,
    user,
  };
};

export const SET_USERS = (users: UserType[]) => {
  return {
    type: USER_ACTIONS.SET_USERS,
    users,
  };
};

export const SET_CURRENT_USER_CHAT_ROOM = (chatRoom: ChatRoomType) => {
  return {
    type: USER_ACTIONS.SET_CURRENT_USER_CHAT_ROOM,
    chatRoom,
  };
};
