import { Avatar, Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { LuLogOut } from "react-icons/lu";
import { useAppDispatch } from "@app/providers/store";
import { logoutUser, useGetMeQuery } from "@entities/session";

export const UserInfo = () => {
  const dispatch = useAppDispatch();
  const { data: user } = useGetMeQuery();

  if (!user) return null;

  return (
    <Flex align="center" gap={3} py={4}>
      <Avatar.Root size="md" flexShrink={0}>
        <Avatar.Fallback name={user.full_name} />
      </Avatar.Root>
      <Box minW={0} flex="1">
        <Text fontSize="12px">{user.full_name}</Text>
      </Box>
      <IconButton
        aria-label="Выйти"
        size="sm"
        variant="ghost"
        onClick={() => dispatch(logoutUser())}
      >
        <LuLogOut />
      </IconButton>
    </Flex>
  );
};
