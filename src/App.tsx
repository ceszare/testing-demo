import * as React from "react";
import "./styles.css";

import { initializeIcons } from "@fluentui/react";
import { DataGridExample } from "./examples/DataGridExample";

initializeIcons();

export default function App() {
  return (
    <div className="App">
      <DataGridExample />
    </div>
  );
}
