// src/routes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/protected-route";
import { LoginForm } from "./components/auth/login-form";
import { TeamSearch } from "./components/search/team-search";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TeamSearch />} />
      <Route path="/teams" element={<TeamSearch />} />
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/scouting"
        element={
          <ProtectedRoute>
            <div>Scouting Page (Protected)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <div>Admin Page (Protected)</div>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
};