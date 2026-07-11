import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PortfolioPager from "../app/PortfolioPager";
import "../app/globals.css";
import "../app/pager.css";
import "./github-pages.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("GitHub Pages root element is missing.");
}

createRoot(root).render(
  <StrictMode>
    <PortfolioPager />
  </StrictMode>,
);
