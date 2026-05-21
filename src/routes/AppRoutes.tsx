import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { TourPage } from "../pages/TourPage";
import { AboutPage } from "../pages/AboutPage";
import { AdminPage } from "../pages/AdminPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tour" element={<TourPage />} />
        <Route path="/tour/:locationId" element={<TourPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
