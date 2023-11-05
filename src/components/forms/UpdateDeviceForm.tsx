import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../types";
import { updateDevice } from "../../api/apiDevice/DeviceApi";
import { SET_DEVICES } from "../../store/actions/DeviceActions";
import { Modal, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styleForm } from "./styledComponenets";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface UpdateDeviceFormProps {
  isFormOpen: boolean;
  setIsFormOpen: (value: boolean) => void;
  deviceId: number;
}

const UpdateDeviceForm = ({
  isFormOpen,
  setIsFormOpen,
  deviceId,
}: UpdateDeviceFormProps) => {
  const { devices } = useSelector((state: RootState) => state.device);

  const [description, setDescription] = useState("");
  const [maxHourlyConsumption, setMaxHourlyConsumption] = useState(0);
  const [address, setAddress] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (description || maxHourlyConsumption > 0 || address) {
      try {
        const { data: updatedDevice } = await updateDevice({
          deviceId,
          description,
          maxHourlyConsumption,
          address,
        });

        const updatedDevices = devices.map((device) => {
          if (device.id === updatedDevice.id) {
            return updatedDevice;
          }

          return device;
        });

        dispatch(SET_DEVICES(updatedDevices));

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
          sx={{ marginBottom: 2 }}
        />
        <TextField
          type="number"
          label="Max Hourly Consumption"
          onChange={(e) => setMaxHourlyConsumption(parseFloat(e.target.value))}
          value={maxHourlyConsumption}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          type="text"
          label="Address"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
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
            Update Device
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

export default UpdateDeviceForm;
