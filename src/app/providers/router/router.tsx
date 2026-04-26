import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginPage } from "@pages/login";
import { RegisterPage } from "@pages/register";
import { HomePage } from "@pages/home";
import { RequireAuth } from "./RequireAuth";
import { AppRoute } from "./routes";

const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      {
        path: AppRoute.Home,
        element: <HomePage />,
      },
    ],
  },
  {
    path: AppRoute.Login,
    element: <LoginPage />,
  },
  {
    path: AppRoute.Register,
    element: <RegisterPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
