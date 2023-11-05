import { DEVICE_ACTIONS, DeviceType } from "../../types";
import { DeviceAction, DeviceState } from "../types/DeviceReducerTypes";

export const INITIAL_STATE_DEVICE: DeviceType = {
  id: 0,
  userId: 0,
  address: "",
  description: "",
  maxHourlyConsumption: 0,
};

const INITIAL_STATE: DeviceState = {
  devices: [],
  currentUserDevices: [],
};

const DeviceReducer = (
  state = INITIAL_STATE,
  action: DeviceAction
): DeviceState => {
  switch (action.type) {
    case DEVICE_ACTIONS.SET_DEVICES:
      return { ...state, devices: action.devices };
    case DEVICE_ACTIONS.SET_CURRENT_USER_DEVICES:
      return { ...state, currentUserDevices: action.currentUserDevices };
    default:
      return state;
  }
};

export default DeviceReducer;
