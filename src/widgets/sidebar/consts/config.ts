import { AppRoute } from "@app/providers/router/routes";
import type { IconType } from "react-icons";
import { LuHouse, LuLayoutList, LuBookOpen, LuDownload } from "react-icons/lu";

type NavigationChild = {
  label: string;
  to: AppRoute;
};

type NavigationItemSimple = {
  label: string;
  to: AppRoute;
  IconContent: IconType;
  children?: never;
};

type NavigationItemParent = {
  label: string;
  to?: never;
  IconContent: IconType;
  children: NavigationChild[];
};

export type NavigationItem = NavigationItemSimple | NavigationItemParent;

export const NAVIGATION_LINKS: NavigationItem[] = [
  { label: "Главная", to: AppRoute.Home, IconContent: LuHouse },
  {
    label: "Реестры",
    IconContent: LuLayoutList,
    children: [
      { label: "Проекты счетов-фактур", to: AppRoute.InvoiceProjects },
      { label: "Оформленные счета-фактуры", to: AppRoute.FormattedInvoices },
    ],
  },
  {
    label: "Справочники",
    IconContent: LuBookOpen,
    children: [
      { label: "Ответственные по счетам-фактурам", to: AppRoute.InvoiceResponsible },
      { label: "Счета по учетам НДС", to: AppRoute.VatAccounts },
      { label: "Счета доходов", to: AppRoute.IncomeAccounts },
      { label: "Отделения", to: AppRoute.Branches },
    ],
  },
  { label: "Журнал загрузки из АБС", to: AppRoute.AbsUploadLog, IconContent: LuDownload },
];

export const SIDEBAR_WIDTH = "210px";
