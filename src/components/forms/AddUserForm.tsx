import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createUser } from "../../api/apiUser/UserApi";
import { Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SET_USERS } from "../../store/actions/UserActions";
import { RootState } from "../../types";
import Box from "@mui/material/Box";
import { styleForm } from "./styledComponenets";

interface AddUserFormProps {
  isFormOpen: boolean;
  setIsFormOpen: (value: boolean) => void;
}

const AddUserForm = ({ isFormOpen, setIsFormOpen }: AddUserFormProps) => {
  const { users } = useSelector((state: RootState) => state.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (firstName && lastName && phoneNumber && password && email) {
      try {
        const { data: addedUser } = await createUser({
          firstName,
          lastName,
          phoneNumber,
          password,
          email,
        });

        dispatch(SET_USERS([addedUser, ...users]));

        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setPassword("");
        setEmail("");
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
          Add User
        </Typography>
        <TextField
          type="text"
          label="First Name"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          type="text"
          label="Last Name"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          type="tel"
          label="Phone Number"
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phoneNumber}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          type="password"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          type="email"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Create User
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

export default AddUserForm;
