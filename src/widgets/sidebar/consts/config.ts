import { AppRoute } from "@app/providers/router/routes";
import type { IconType } from "react-icons";
import { LuHouse } from "react-icons/lu";

type NavigationItem = {
  label: string;
  to: AppRoute;
  IconContent: IconType;
};

export const NAVIGATION_LINKS: Array<NavigationItem> = [
  { label: "Главная", to: AppRoute.Home, IconContent: LuHouse },
];

export const SIDEBAR_WIDTH = "210px";
