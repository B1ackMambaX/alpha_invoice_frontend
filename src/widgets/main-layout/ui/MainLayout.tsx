import type { ReactNode } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Sidebar } from "@widgets/sidebar";

type MainLayoutProps = {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
};

export const MainLayout = ({ title, subtitle, children }: MainLayoutProps) => (
  <Flex minH="100vh">
    <Sidebar />
    <Flex flexDirection="column" flex="1" p={8} bg="bg.muted">
      <Box mb={6}>
        <Heading size="2xl">{title}</Heading>
        {subtitle}
      </Box>
      <Box borderRadius="12px" p="16px" bg="white" flex="1">
        {children}
      </Box>
    </Flex>
  </Flex>
);
