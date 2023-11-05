import { DEVICE_ACTIONS, DeviceType } from "../../types";

export type DeviceAction = {
  type: DEVICE_ACTIONS;
  devices: DeviceType[];
  currentUserDevices: DeviceType[];
};

export type DeviceState = {
  devices: DeviceType[];
  currentUserDevices: DeviceType[];
};
