import axios from "axios";

interface CreateUserParams {
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  email: string;
}

interface UpdateUserParams {
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface DeleteUserParams {
  userId: number;
}

const userApi = axios.create({
  baseURL: "http://localhost:3000/user",
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token !== null ? `Bearer ${token}` : "";
  return config;
});

export const getAllUsers = () => {
  return userApi.get("/getAll");
};

export const createUser = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
}: CreateUserParams) => {
  return userApi.post("/createUser", {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
  });
};

export const updateUser = ({
  userId,
  firstName,
  lastName,
  phoneNumber,
}: UpdateUserParams) => {
  return userApi.patch(`/${userId}`, {
    firstName,
    lastName,
    phoneNumber,
  });
};

export const deleteUser = ({ userId }: DeleteUserParams) => {
  return userApi.delete(`/${userId}`);
};

export default userApi;
