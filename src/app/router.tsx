import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../modules/auth/pages/LoginPage";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { HomePage } from "../modules/home/page/HomePage";

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
    element: <DashboardLayout />,
    children: [{ index: true, element: <div>Dashboard</div> }],
  },
]);
