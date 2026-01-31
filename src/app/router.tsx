import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../components/auth/LoginPage";
import { HomePage } from "../components/home/HomePage";
import { RequireAuth } from "../components/auth/RequireAuth";
import { UsersPage } from "../components/users/UsersPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/users",
        element: <UsersPage />,
      },
      {
        path: "/",
        element: <Navigate to="/home" replace />,
      },
    ],
  },
]);
