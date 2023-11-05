import axios from "axios";

interface CreateDeviceParams {
  address: string;
  description: string;
  maxHourlyConsumption: number;
}

interface UpdateDeviceParams {
  deviceId: number;
  address: string;
  description: string;
  maxHourlyConsumption: number;
}

interface DeleteDeviceParams {
  deviceId: number;
}

interface GetDevicesByUserParams {
  userId: number;
}

interface AssociateDeviceParams {
  userId: number;
  deviceId: number;
}

const deviceApi = axios.create({
  baseURL: "http://localhost:3001/device",
});

deviceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token !== null ? `Bearer ${token}` : "";
  return config;
});

export const getAllDevices = () => {
  return deviceApi.get("/getAll");
};

export const getDevicesByUser = ({ userId }: GetDevicesByUserParams) => {
  return deviceApi.get(`getByUser/${userId}`);
};

export const createDevice = ({
  address,
  description,
  maxHourlyConsumption,
}: CreateDeviceParams) => {
  return deviceApi.post("/createDevice", {
    address,
    description,
    maxHourlyConsumption,
  });
};

export const updateDevice = ({
  deviceId,
  address,
  description,
  maxHourlyConsumption,
}: UpdateDeviceParams) => {
  return deviceApi.patch(`/${deviceId}`, {
    address,
    description,
    maxHourlyConsumption,
  });
};

export const deleteDevice = ({ deviceId }: DeleteDeviceParams) => {
  return deviceApi.delete(`/${deviceId}`);
};

export const associateDevice = ({
  userId,
  deviceId,
}: AssociateDeviceParams) => {
  return deviceApi.patch(`/associateDevice/${deviceId}`, { userId });
};

export default deviceApi;
