import { Flex, Image } from "@chakra-ui/react";
import { NavigationBar } from "./navigation-bar";
import { UserInfo } from "./user-info";
import { SIDEBAR_WIDTH } from "../consts/config";

export const Sidebar = () => (
  <Flex
    as="aside"
    flexDirection="column"
    w={SIDEBAR_WIDTH}
    px="12px"
    pt="12px"
    minW={SIDEBAR_WIDTH}
    minH="100vh"
    borderRightWidth="1px"
    borderRightColor="border"
    bg="white"
  >
    <Flex justifyContent="center">
      <Image maxW="64px" src="/logo.svg" />
    </Flex>
    <NavigationBar />
    <UserInfo />
  </Flex>
);
