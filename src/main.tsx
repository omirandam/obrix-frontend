import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "rsuite/dist/rsuite.min.css";
import { CustomProvider } from "rsuite";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CustomProvider>
      <App />
    </CustomProvider>
  </StrictMode>
);
