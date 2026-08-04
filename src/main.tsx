import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { defineElement } from "@lordicon/element";
import App from "./App";
import { preloadCategoryLotties } from "./lib/lottiePreload";
import "./index.css";

defineElement();
preloadCategoryLotties();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
