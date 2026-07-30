import React from "react";

import ControlView from "./components/control-view";
import Gallery from "./components/gallery";
import KioskView from "./components/kiosk-view";

function App() {
  const params = new URLSearchParams(window.location.search);
  const locationId = params.get("location");

  if (locationId) {
    return <KioskView locationId={locationId} nav={params.get("nav") === "1"} />;
  }

  if (params.get("view") === "gallery") {
    return <Gallery />;
  }

  return <ControlView />;
}

export default App;
