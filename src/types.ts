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

export enum USER_ACTIONS {
  SET_CURRENT_USER = "SET_CURRENT_USER",
  SET_USERS = "SET_USERS",
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
