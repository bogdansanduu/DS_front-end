import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import DeviceReducer from "./DeviceReducer";

export const AllReducers = combineReducers({
  user: UserReducer,
  device: DeviceReducer,
});
