import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { LoginPage } from "@pages/login";
import { RegisterPage } from "@pages/register";
import { InvoiceProjectsPage } from "@pages/registries/invoice-projects";
import { FormattedInvoicesPage } from "@pages/registries/formatted-invoices";
import { InvoiceResponsiblePage } from "@pages/references/invoice-responsible";
import { VatAccountsPage } from "@pages/references/vat-accounts";
import { IncomeAccountsPage } from "@pages/references/income-accounts";
import { BranchesPage } from "@pages/references/branches";
import { AbsUploadLogPage } from "@pages/abs-upload-log";
import { ReportsPage } from "@pages/reports";
import { RequireAuth } from "./RequireAuth";
import { AppRoute } from "./routes";

const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      { path: AppRoute.Home, element: <Navigate to={AppRoute.InvoiceProjects} replace /> },
      { path: AppRoute.InvoiceProjects, element: <InvoiceProjectsPage /> },
      { path: AppRoute.FormattedInvoices, element: <FormattedInvoicesPage /> },
      { path: AppRoute.InvoiceResponsible, element: <InvoiceResponsiblePage /> },
      { path: AppRoute.VatAccounts, element: <VatAccountsPage /> },
      { path: AppRoute.IncomeAccounts, element: <IncomeAccountsPage /> },
      { path: AppRoute.Branches, element: <BranchesPage /> },
      { path: AppRoute.AbsUploadLog, element: <AbsUploadLogPage /> },
      { path: AppRoute.Reports, element: <ReportsPage /> },
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
