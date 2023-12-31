import { UserState } from "./store/types/UserReducerTypes";
import { DeviceState } from "./store/types/DeviceReducerTypes";

export interface UserType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: { id: number; name: string }[];
}

export interface Message {
  id: number;
  userId: number;
  userName: string;
  text: string;
  createdAt: string;
  seenBy: { id: number; userId: number }[];
}

export interface ChatRoomType {
  id: number;
  hostId: number;
  name: string;
}

export enum USER_ACTIONS {
  SET_CURRENT_USER = "SET_CURRENT_USER",
  SET_USERS = "SET_USERS",
  SET_CURRENT_USER_CHAT_ROOM = "SET_CURRENT_USER_CHAT_ROOM",
}

//--------------DEVICE------------

export interface DeviceType {
  id: number;
  userId: number;
  description: string;
  maxHourlyConsumption: number;
  address: string;
}

export enum DEVICE_ACTIONS {
  SET_DEVICES = "SET_DEVICES",
  SET_CURRENT_USER_DEVICES = "SET_CURRENT_USER_DEVICES",
}

//--------------STORE--------------

export type RootState = {
  user: UserState;
  device: DeviceState;
};
