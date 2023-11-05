import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeviceType, RootState } from "../../types";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@material-ui/core";
import { IconButton } from "@mui/material";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import { deleteDevice, getAllDevices } from "../../api/apiDevice/DeviceApi";
import { SET_DEVICES } from "../../store/actions/DeviceActions";
import AddDeviceForm from "../../components/forms/AddDeviceForm";
import UpdateDeviceForm from "../../components/forms/UpdateDeviceForm";
import AssociateDeviceForm from "../../components/forms/AssociateDeviceForm";

const AllDevicesPage = () => {
  const { devices } = useSelector((state: RootState) => state.device);

  const [currentDeviceId, setCurrentDeviceId] = useState(-1);
  const [isAssociateDeviceFormOpen, setIsAssociateDeviceFormOpen] =
    useState<boolean>(false);
  const [isAddDeviceFormOpen, setIsAddDeviceFormOpen] =
    useState<boolean>(false);
  const [isUpdateDeviceFormOpen, setIsUpdateDeviceFormOpen] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  const fetchDevices = async () => {
    try {
      const { data: devices } = await getAllDevices();

      dispatch(SET_DEVICES(devices));
    } catch (e) {
      console.log("Problem fetching devices!!!");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchDevices();
    })();
    // eslint-disable-next-line
  }, []);

  const handleOpenAddDeviceForm = () => {
    setIsAddDeviceFormOpen(true);
  };

  const handleOpenUpdateDeviceForm = (deviceId: number) => {
    setIsUpdateDeviceFormOpen(true);
    setCurrentDeviceId(deviceId);
  };

  const handleOpenAssociateDeviceForm = (deviceId: number) => {
    setIsAssociateDeviceFormOpen(true);
    setCurrentDeviceId(deviceId);
  };

  const handleDelete = async (deviceId: number) => {
    try {
      const { data: message } = await deleteDevice({
        deviceId,
      });

      const devicesUpdated = devices.filter((device) => device.id !== deviceId);
      dispatch(SET_DEVICES(devicesUpdated));
      console.log(message);
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  return (
    <>
      <AssociateDeviceForm
        isFormOpen={isAssociateDeviceFormOpen}
        setIsFormOpen={setIsAssociateDeviceFormOpen}
        deviceId={currentDeviceId}
      />
      <AddDeviceForm
        isFormOpen={isAddDeviceFormOpen}
        setIsFormOpen={setIsAddDeviceFormOpen}
      />
      <UpdateDeviceForm
        isFormOpen={isUpdateDeviceFormOpen}
        setIsFormOpen={setIsUpdateDeviceFormOpen}
        deviceId={currentDeviceId}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Typography variant="h5">All Devices</Typography>
        <IconButton aria-label="add" onClick={handleOpenAddDeviceForm}>
          <AddToQueueIcon fontSize={"large"} />
        </IconButton>
      </div>
      <Divider />
      {Array.isArray(devices) &&
        devices.map((device: DeviceType) => (
          <React.Fragment key={device.id}>
            <Card style={{ margin: "16px 0" }}>
              <CardHeader
                avatar={<Avatar>{`D`}</Avatar>}
                title={`${device.description}`}
                subheader={`Address: ${device.address}`}
                action={
                  <div style={{ display: "flex", gap: "10px" }}>
                    <IconButton
                      aria-label="ban"
                      onClick={() => handleOpenAssociateDeviceForm(device.id)}
                    >
                      <ElectricalServicesIcon />
                    </IconButton>
                    <IconButton
                      aria-label="ban"
                      onClick={() => handleOpenUpdateDeviceForm(device.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="ban"
                      onClick={() => handleDelete(device.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                }
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  <p>DEVICE ID: {device.id}</p>
                  <p>USER ID: {device.userId}</p>
                  <p>MAX HOURLY CONSUMPTION: {device.maxHourlyConsumption}</p>
                </Typography>
              </CardContent>
            </Card>
          </React.Fragment>
        ))}
    </>
  );
};

export default AllDevicesPage;
