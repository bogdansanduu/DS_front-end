import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage/HomePage";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistedStore } from "./store/store";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import RoleRestrictedRoute from "./components/routeRestrictors/RoleRestrictedRoute";
import { ROLE } from "./constants";
import UsersPage from "./pages/UsersPage/UsersPage";
import AllDevicesPage from "./pages/AllDevicesPage/AllDevicesPage";
import UserDevicesPage from "./pages/UserDevicesPage/UserDevicesPage";
import EnergyConsumptionPage from "./pages/EnegryConsumptionPage/EnergyConsumptionPage";

const NotImplemented = () => {
  return <div>Not Implemented yet</div>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <Navigate to={"/home"} />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/devices",
        element: (
          <RoleRestrictedRoute role={ROLE.User}>
            <UserDevicesPage />
          </RoleRestrictedRoute>
        ),
      },
      {
        path: "/energy_consumption",
        element: (
          <RoleRestrictedRoute role={ROLE.User}>
            <EnergyConsumptionPage />
          </RoleRestrictedRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <RoleRestrictedRoute role={ROLE.Admin}>
            <UsersPage />
          </RoleRestrictedRoute>
        ),
      },
      {
        path: "/all_devices",
        element: (
          <RoleRestrictedRoute role={ROLE.Admin}>
            <AllDevicesPage />
          </RoleRestrictedRoute>
        ),
      },
      {
        path: "/access_denied",
        element: <AccessDeniedPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={persistedStore.store}>
    <PersistGate persistor={persistedStore.persistor}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
