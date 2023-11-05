import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { updateUser } from "../../api/apiUser/UserApi";
import { Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SET_USERS } from "../../store/actions/UserActions";
import { RootState } from "../../types";
import Box from "@mui/material/Box";
import { styleForm } from "./styledComponenets";

interface UpdateUserFormProps {
  isFormOpen: boolean;
  setIsFormOpen: (value: boolean) => void;
  userId: number;
}

const UpdateUserForm = ({
  isFormOpen,
  setIsFormOpen,
  userId,
}: UpdateUserFormProps) => {
  const { users } = useSelector((state: RootState) => state.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (firstName || lastName || phoneNumber) {
      try {
        const { data: updatedUser } = await updateUser({
          userId,
          firstName,
          lastName,
          phoneNumber,
        });

        const updatedUsers = users.map((user) => {
          if (user.id === updatedUser.id) {
            return updatedUser;
          }

          return user;
        });

        dispatch(SET_USERS(updatedUsers));

        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setIsFormOpen(false);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)}>
      <Box sx={styleForm}>
        <Typography
          variant="h6"
          component="h2"
          style={{ marginBottom: "20px" }}
        >
          Update User
        </Typography>
        <TextField
          type="text"
          label="First Name"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          type="text"
          label="Last Name"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          type="tel"
          label="Phone Number"
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phoneNumber}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Update User
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => setIsFormOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateUserForm;
