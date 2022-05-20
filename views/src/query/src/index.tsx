import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

let mod = module as any;
if (mod.hot) {
  mod.hot.accept();
}
