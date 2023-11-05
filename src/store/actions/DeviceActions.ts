import { DEVICE_ACTIONS, DeviceType } from "../../types";

export const SET_DEVICES = (devices: DeviceType[]) => {
  return {
    type: DEVICE_ACTIONS.SET_DEVICES,
    devices,
  };
};

export const SET_CURRENT_USER_DEVICES = (currentUserDevices: DeviceType[]) => {
  return {
    type: DEVICE_ACTIONS.SET_CURRENT_USER_DEVICES,
    currentUserDevices,
  };
};
