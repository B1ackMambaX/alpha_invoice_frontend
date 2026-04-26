import type { ReactNode } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Sidebar } from "@widgets/sidebar";

type MainLayoutProps = {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export const MainLayout = ({
  title,
  subtitle,
  actions,
  children,
}: MainLayoutProps) => (
  <Flex h="100vh">
    <Sidebar />
    <Flex flexDirection="column" flex="1" minW={0} p={8} bg="bg.muted">
      <Flex mb={6} justify="space-between" align="flex-end">
        <Box>
          <Heading size="2xl">{title}</Heading>
          {subtitle}
        </Box>
        {actions && <Box>{actions}</Box>}
      </Flex>
      <Box
        borderRadius="12px"
        p="16px"
        bg="white"
        flex="1"
        minH={0}
        overflow="hidden"
      >
        {children}
      </Box>
    </Flex>
  </Flex>
);
