import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/views/Home";
import TipsList from "./pages/views/TipsList";
import Results from "./pages/views/Results";
import Review from "./pages/views/Review";
import CreateTip from "./pages/views/CreateTip";
import Subscribe from "./pages/views/Subscribe";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="free-tips" element={<TipsList vip={false} />} />
          <Route path="vip-tips" element={<TipsList vip={true} />} />
          <Route path="results" element={<Results />} />
          <Route path="create" element={<CreateTip />} />
          <Route path="review" element={<Review />} />
          <Route path="subscribe" element={<Subscribe />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
