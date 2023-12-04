import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeviceType, RootState } from "../../types";
import { getDevicesByUser } from "../../api/apiDevice/DeviceApi";
import { SET_CURRENT_USER_DEVICES } from "../../store/actions/DeviceActions";

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@material-ui/core";

const UserDevicesPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currentUserDevices } = useSelector(
    (state: RootState) => state.device
  );

  const dispatch = useDispatch();

  const fetchDevices = async () => {
    try {
      const { data: devices } = await getDevicesByUser({
        userId: currentUser.id,
      });

      dispatch(SET_CURRENT_USER_DEVICES(devices));
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

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Typography variant="h5">My Devices</Typography>
      </div>
      <Divider />
      {Array.isArray(currentUserDevices) &&
        currentUserDevices.map((device: DeviceType) => (
          <React.Fragment key={device.id}>
            <Card style={{ margin: "16px 0" }}>
              <CardHeader
                avatar={<Avatar>{`D`}</Avatar>}
                title={`${device.description}`}
                subheader={`Address: ${device.address}`}
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

export default UserDevicesPage;
