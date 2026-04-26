import { Flex, Icon, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";

type NavButtonProps = {
  isActive?: boolean;
  IconContent: IconType;
  label: string;
};

export function NavButton({ isActive, IconContent, label }: NavButtonProps) {
  return (
    <Flex
      gap="8px"
      alignItems="flex-start"
      justifyContent="flex-start"
      px={3}
      py={2}
      borderRadius="12px"
      fontWeight="medium"
      color={isActive ? "brand" : "fg"}
      _hover={{ bg: "bg.muted" }}
      transition="0.3s all"
      cursor="pointer"
      userSelect="none"
    >
      <Icon size="lg" color={isActive ? "brand" : "fg"}>
        <IconContent />
      </Icon>
      <Text fontSize="14px">{label}</Text>
    </Flex>
  );
}
