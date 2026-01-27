import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../components/auth/LoginPage";
import { HomePage } from "../components/home/HomePage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
]);
