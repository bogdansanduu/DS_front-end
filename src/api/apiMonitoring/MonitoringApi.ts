import axios from "axios";

interface GetConsumptionByIdAndDateParams {
  deviceId: number;
  date: string;
}

const deviceApi = axios.create({
  baseURL: "http://localhost:3002/monitoring",
});

deviceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token !== null ? `Bearer ${token}` : "";
  return config;
});

export const getConsumptionByIdAndDate = ({
  deviceId,
  date,
}: GetConsumptionByIdAndDateParams) => {
  return deviceApi.get(`getConsumptionByIdAndDate/${deviceId}/${date}`);
};
