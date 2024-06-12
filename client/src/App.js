import React from "react";
import {BrowserRouter ,useRoutes} from "react-router-dom";
import CustomersFilter from "./pages/CustomersFilter"
import OldCampaign from "./pages/OldCampaign"

const ApplyRoute = () => {
  let routes = useRoutes([
    { path: "/", element: <CustomersFilter/> },
    { path: "/OldCampaign", element: <OldCampaign/> },
  ]);
  return routes;
};

const App = () => {
  return (
    <BrowserRouter>
      <ApplyRoute />
    </BrowserRouter>
  );
};

export default App;
