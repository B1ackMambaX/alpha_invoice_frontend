import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useAppSelector } from "@app/providers/store";

export const UserInfo = () => {
  const user = useAppSelector((state) => state.session.user);

  if (!user) return null;

  return (
    <Flex align="center" gap={3} py={4}>
      <Avatar.Root size="xl" flexShrink={0}>
        <Avatar.Fallback name={user.full_name} />
      </Avatar.Root>
      <Box minW={0}>
        <Text fontSize="14px">{user.full_name}</Text>
      </Box>
    </Flex>
  );
};
