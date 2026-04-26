import { NavLink, useLocation } from "react-router";
import { VStack } from "@chakra-ui/react";
import { NavButton, NavParentItem } from "@features/nav-button";
import { NAVIGATION_LINKS } from "../consts/config";

export const NavigationBar = () => {
  const { pathname } = useLocation();

  return (
    <VStack as="nav" gap={1} align="stretch" flex="1" mt="64px">
      {NAVIGATION_LINKS.map((item) => {
        if (item.children) {
          const isChildActive = item.children.some(({ to }) => pathname.startsWith(to));
          return (
            <NavParentItem
              key={item.label}
              label={item.label}
              IconContent={item.IconContent}
              children={item.children}
              isChildActive={isChildActive}
            />
          );
        }

        return (
          <NavLink key={item.to} to={item.to}>
            {({ isActive }) => (
              <NavButton
                isActive={isActive}
                label={item.label}
                IconContent={item.IconContent}
              />
            )}
          </NavLink>
        );
      })}
    </VStack>
  );
};
