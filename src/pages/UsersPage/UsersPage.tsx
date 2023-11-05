import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Avatar,
} from "@material-ui/core";

import { RootState, UserType } from "../../types";
import { deleteUser, getAllUsers } from "../../api/apiUser/UserApi";
import { SET_USERS } from "../../store/actions/UserActions";
import AddUserForm from "../../components/forms/AddUserForm";
import UpdateUserForm from "../../components/forms/UpdateUserForm";

const UsersPage = () => {
  const { users } = useSelector((state: RootState) => state.user);

  const [currentUserId, setCurrentUserId] = useState(-1);
  const [isAddUserFormOpen, setIsAddUserFormOpen] = useState<boolean>(false);
  const [isUpdateUserFormOpen, setIsUpdateUserFormOpen] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  const fetchUsers = async () => {
    try {
      const { data: users } = await getAllUsers();

      dispatch(SET_USERS(users));
    } catch (e) {
      console.log("Problem fetching users!!!");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();
    // eslint-disable-next-line
  }, []);

  const handleOpenAddUserForm = () => {
    setIsAddUserFormOpen(true);
  };

  const handleOpenUpdateUserForm = (userId: number) => {
    setIsUpdateUserFormOpen(true);
    setCurrentUserId(userId);
  };

  const handleDelete = async (userId: number) => {
    try {
      const { data: message } = await deleteUser({
        userId,
      });

      const usersUpdated = users.filter((user) => user.id !== userId);
      dispatch(SET_USERS(usersUpdated));
      console.log(message);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <AddUserForm
        isFormOpen={isAddUserFormOpen}
        setIsFormOpen={setIsAddUserFormOpen}
      />
      <UpdateUserForm
        isFormOpen={isUpdateUserFormOpen}
        setIsFormOpen={setIsUpdateUserFormOpen}
        userId={currentUserId}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Typography variant="h5">All Users</Typography>
        <IconButton aria-label="add" onClick={handleOpenAddUserForm}>
          <PersonAddIcon fontSize={"large"} />
        </IconButton>
      </div>
      <Divider />
      {Array.isArray(users) &&
        users.map((user: UserType) => (
          <React.Fragment key={user.id}>
            <Card style={{ margin: "16px 0" }}>
              <CardHeader
                avatar={
                  <Avatar>{`${user.firstName[0]}${user.lastName[0]}`}</Avatar>
                }
                title={`${user.firstName} ${user.lastName}`}
                subheader={`ROLE: ${user.roles[0].name}`}
                action={
                  <div style={{ display: "flex", gap: "10px" }}>
                    <IconButton
                      aria-label="ban"
                      onClick={() => handleOpenUpdateUserForm(user.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="ban"
                      onClick={() => handleDelete(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                }
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  <p>USER ID: {user.id}</p>
                  <p>EMAIL: {user.email}</p>
                  <p>TEL: {user.phoneNumber}</p>
                </Typography>
              </CardContent>
            </Card>
          </React.Fragment>
        ))}
    </>
  );
};

export default UsersPage;
