import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createDevice } from "../../api/apiDevice/DeviceApi";
import { Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SET_DEVICES } from "../../store/actions/DeviceActions";
import { RootState } from "../../types";
import Box from "@mui/material/Box";
import { styleForm } from "./styledComponenets";

interface AddDeviceFormProps {
  isFormOpen: boolean;
  setIsFormOpen: (value: boolean) => void;
}

const AddDeviceForm = ({ isFormOpen, setIsFormOpen }: AddDeviceFormProps) => {
  const { devices } = useSelector((state: RootState) => state.device);

  const [description, setDescription] = useState("");
  const [maxHourlyConsumption, setMaxHourlyConsumption] = useState(0);
  const [address, setAddress] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (description && maxHourlyConsumption > 0 && address) {
      try {
        const { data: addedDevice } = await createDevice({
          description,
          maxHourlyConsumption,
          address,
        });

        dispatch(SET_DEVICES([addedDevice, ...devices]));

        setDescription("");
        setMaxHourlyConsumption(0);
        setAddress("");
        setIsFormOpen(false);
      } catch (error) {
        console.error("Error creating device:", error);
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
          Add Device
        </Typography>
        <TextField
          type="text"
          label="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          type="number"
          label="Max Hourly Consumption"
          onChange={(e) => setMaxHourlyConsumption(parseFloat(e.target.value))}
          value={maxHourlyConsumption}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          type="text"
          label="Address"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
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
            Create Device
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

export default AddDeviceForm;
