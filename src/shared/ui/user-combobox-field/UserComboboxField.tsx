import { useState, useMemo, useRef } from "react";
import {
  Menu,
  Portal,
  FieldRoot,
  FieldLabel,
  FieldErrorText,
  Input,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";
import { Field } from "react-final-form";
import type { UserItem } from "@entities/user";

interface UserComboboxFieldProps {
  name: string;
  label: string;
  users: UserItem[];
}

function userLabel(u: UserItem) {
  return u.full_name ? `${u.full_name} (${u.username})` : u.username;
}

export function UserComboboxField({ name, label, users }: UserComboboxFieldProps) {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const visibleUsers = useMemo(() => {
    if (!search.trim()) return users;
    const lower = search.toLowerCase();
    return users.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(lower) ||
        u.username.toLowerCase().includes(lower),
    );
  }, [users, search]);

  return (
    <Field name={name}>
      {({ input, meta }) => {
        const isInvalid = meta.touched && !!meta.error;
        const selectedUser = users.find((u) => u.id === input.value);

        return (
          <FieldRoot invalid={isInvalid}>
            <FieldLabel>{label}</FieldLabel>
            <Menu.Root
              onOpenChange={(e) => {
                if (e.open) {
                  setSearch("");
                  setTimeout(() => searchRef.current?.focus(), 50);
                } else {
                  input.onBlur();
                }
              }}
            >
              <Menu.Trigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  w="100%"
                  h="10"
                  px="3"
                  borderRadius="16px"
                  borderColor={isInvalid ? "red.500" : "border"}
                  bg="transparent"
                  justifyContent="space-between"
                  _focus={{ outline: "none", boxShadow: "outline" }}
                >
                  <Text
                    fontSize="sm"
                    color={selectedUser ? "fg" : "fg.subtle"}
                    truncate
                  >
                    {selectedUser ? userLabel(selectedUser) : "Выберите пользователя"}
                  </Text>
                  <LuChevronDown />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner width="var(--reference-width)">
                  <Menu.Content maxH="280px" overflowY="auto">
                    <Box
                      px={2}
                      py={2}
                      position="sticky"
                      top={0}
                      bg="bg"
                      zIndex={1}
                      borderBottomWidth="1px"
                    >
                      <Input
                        ref={searchRef}
                        size="sm"
                        placeholder="Поиск по ФИО..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </Box>
                    {visibleUsers.length === 0 ? (
                      <Box px={3} py={2} fontSize="sm" color="fg.muted">
                        Пользователи не найдены
                      </Box>
                    ) : (
                      visibleUsers.map((user) => (
                        <Menu.Item
                          key={user.id}
                          value={user.id}
                          fontWeight={input.value === user.id ? "semibold" : "normal"}
                          onClick={() => input.onChange(user.id)}
                        >
                          {userLabel(user)}
                        </Menu.Item>
                      ))
                    )}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            {isInvalid && <FieldErrorText>{meta.error}</FieldErrorText>}
          </FieldRoot>
        );
      }}
    </Field>
  );
}
