import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { RootState } from "../../types";
import { styleForm } from "./styledComponenets";
import { associateDevice } from "../../api/apiDevice/DeviceApi";
import { SET_DEVICES } from "../../store/actions/DeviceActions";

interface AssociateDeviceFormProps {
  isFormOpen: boolean;
  setIsFormOpen: (value: boolean) => void;
  deviceId: number;
}

const AssociateDeviceForm = ({
  isFormOpen,
  setIsFormOpen,
  deviceId,
}: AssociateDeviceFormProps) => {
  const { devices } = useSelector((state: RootState) => state.device);
  const { users } = useSelector((state: RootState) => state.user);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const dispatch = useDispatch();

  const handleAssociateDevice = async () => {
    if (selectedUserId !== null) {
      try {
        //await associateDevice(deviceId, selectedUserId);
        // You may want to update the device or user data in the store as needed.

        const { data: updatedDevice } = await associateDevice({
          deviceId,
          userId: selectedUserId,
        });

        const updatedDevices = devices.map((device) => {
          if (device.id === updatedDevice.id) {
            return updatedDevice;
          }

          return device;
        });

        dispatch(SET_DEVICES(updatedDevices));

        setIsFormOpen(false);
      } catch (error) {
        console.error("Error associating device with user:", error);
      }
    } else {
      alert("Please select a user to associate with the device.");
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
          Associate Device with User
        </Typography>
        <TextField
          select
          label="Select User"
          value={selectedUserId || ""}
          fullWidth
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
          sx={{ marginBottom: 2 }}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleAssociateDevice}
          >
            Associate Device
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

export default AssociateDeviceForm;
