import { NavLink } from "react-router";
import { VStack } from "@chakra-ui/react";
import { NavButton } from "@features/nav-button";
import { NAVIGATION_LINKS } from "../consts/config";

export const NavigationBar = () => (
  <VStack as="nav" gap={1} align="stretch" flex="1" mt="64px">
    {NAVIGATION_LINKS.map(({ label, to, IconContent }) => (
      <NavLink key={to} to={to}>
        {({ isActive }) => (
          <NavButton
            isActive={isActive}
            label={label}
            IconContent={IconContent}
          />
        )}
      </NavLink>
    ))}
  </VStack>
);
