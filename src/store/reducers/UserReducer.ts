import { ChatRoomType, USER_ACTIONS, UserType } from "../../types";
import { UserAction, UserState } from "../types/UserReducerTypes";

export const INITIAL_STATE_USER: UserType = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  roles: [{ id: 0, name: "" }],
};

export const INITIAL_STATE_CHAT_ROOM: ChatRoomType = {
  id: 0,
  hostId: 0,
  name: "",
};

const INITIAL_STATE: UserState = {
  currentUser: INITIAL_STATE_USER,
  currentUserChatRoom: INITIAL_STATE_CHAT_ROOM,
  users: [],
};

const UserReducer = (state = INITIAL_STATE, action: UserAction): UserState => {
  switch (action.type) {
    case USER_ACTIONS.SET_CURRENT_USER:
      return { ...state, currentUser: action.user };
    case USER_ACTIONS.SET_USERS:
      return { ...state, users: action.users };
    case USER_ACTIONS.SET_CURRENT_USER_CHAT_ROOM:
      return { ...state, currentUserChatRoom: action.chatRoom };
    default:
      return state;
  }
};

export default UserReducer;
