import { useState } from "react";
import { NavLink } from "react-router";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import type { IconType } from "react-icons";
type ChildItem = {
  label: string;
  to: string;
};

type NavParentItemProps = {
  label: string;
  IconContent: IconType;
  children: ChildItem[];
  isChildActive: boolean;
};

export function NavParentItem({
  label,
  IconContent,
  children,
  isChildActive,
}: NavParentItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      position="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Flex
        gap="8px"
        alignItems="center"
        justifyContent="space-between"
        px={3}
        py={2}
        borderRadius="12px"
        fontWeight="medium"
        color={isChildActive ? "brand" : "fg"}
        bg={isChildActive ? "bg.muted" : undefined}
        _hover={{ bg: "bg.muted" }}
        transition="0.3s all"
        cursor="pointer"
        userSelect="none"
      >
        <Flex gap="8px" alignItems="center">
          <Icon size="lg" color={isChildActive ? "brand" : "fg"}>
            <IconContent />
          </Icon>
          <Text fontSize="14px">{label}</Text>
        </Flex>
        <Icon size="sm" color={isChildActive ? "brand" : "fg.subtle"}>
          <LuChevronRight />
        </Icon>
      </Flex>

      {open && (
        <Box
          position="absolute"
          top="0"
          left="100%"
          zIndex="dropdown"
          bg="white"
          borderWidth="1px"
          borderColor="border"
          borderRadius="12px"
          py={2}
          minW="220px"
          boxShadow="md"
        >
          {children.map(({ label: childLabel, to }) => (
            <NavLink key={to} to={to}>
              {({ isActive }) => (
                <Flex
                  px={4}
                  py={2}
                  fontSize="14px"
                  fontWeight="medium"
                  color={isActive ? "brand" : "fg"}
                  _hover={{ bg: "bg.muted" }}
                  transition="0.2s all"
                  cursor="pointer"
                >
                  {childLabel}
                </Flex>
              )}
            </NavLink>
          ))}
        </Box>
      )}
    </Box>
  );
}
