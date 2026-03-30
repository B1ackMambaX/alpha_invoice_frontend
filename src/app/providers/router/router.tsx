import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginPage } from "@pages/login";
import { RegisterPage } from "@pages/register";
import { RequireAuth } from "./RequireAuth";

const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <div>Главная</div>,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
