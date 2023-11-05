import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChargingStationIcon from "@mui/icons-material/ChargingStation";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router";
import Button from "@mui/material/Button";
import PeopleIcon from "@mui/icons-material/People";

import { SET_CURRENT_USER } from "../../store/actions/UserActions";
import { useDispatch, useSelector } from "react-redux";
import { INITIAL_STATE_USER } from "../../store/reducers/UserReducer";
import { AppBar, Drawer, DrawerHeader, LogoText } from "./styledComponents";
import { RootState } from "../../types";
import { ROLE } from "../../constants";
import logo from "../../assets/images/logo.jpg";

interface SidebarNavProps {
  setToken: (value: string) => void;
}

const SidebarNav = ({ setToken }: SidebarNavProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAdmin = currentUser.roles[0].name === ROLE.Admin;
  const isUser = currentUser.roles[0].name === ROLE.User;

  const handleClick = (route: string) => {
    navigate(route);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    localStorage.clear();
    dispatch(SET_CURRENT_USER(INITIAL_STATE_USER));
    setToken("");
    navigate("/");
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          elevation={4}
          position="fixed"
          sx={{ backgroundColor: "#ffffff", color: "#2f2f2f" }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(!open)}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <img src={logo} alt={"logo"} style={{ height: 50 }} />
            <LogoText>
              Better Energy Project with Improved Sustainability
            </LogoText>
            <Button
              color="warning"
              variant="contained"
              sx={{ marginLeft: "auto" }}
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => handleClick("/home")}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <HomeIcon />
                </ListItemIcon>
                {open && <ListItemText primary={"Home"} />}
              </ListItemButton>
            </ListItem>
            {isUser && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => handleClick("/devices")}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <ChargingStationIcon />
                  </ListItemIcon>
                  {open && <ListItemText primary={"Devices"} />}
                </ListItemButton>
              </ListItem>
            )}
            {isAdmin && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => handleClick("/users")}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <PeopleIcon />
                  </ListItemIcon>
                  {open && <ListItemText primary={"Users"} />}
                </ListItemButton>
              </ListItem>
            )}
            {isAdmin && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => handleClick("/all_devices")}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <ChargingStationIcon />
                  </ListItemIcon>
                  {open && <ListItemText primary={"All Devices"} />}
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <Divider />
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px",
              fontSize: "25px",
            }}
          >
            {String.fromCodePoint(0x1f920)}
          </div>
          <Divider />
        </Drawer>
      </Box>
    </>
  );
};

export default SidebarNav;
