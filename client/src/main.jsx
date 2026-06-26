import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

window.addEventListener("unhandledrejection", (event) => {
  const msg = event.reason?.message ?? "";
  if (msg.includes("WebSocket") && msg.includes("localhost:undefined")) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
