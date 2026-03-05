import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import ConfigEditor from "./ConfigEditor";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/semantic/config/v_demo/editor" replace />} />
        <Route path="/semantic/config/:versionId/editor" element={<ConfigEditor />} />
      </Routes>
    </HashRouter>
  );
}
