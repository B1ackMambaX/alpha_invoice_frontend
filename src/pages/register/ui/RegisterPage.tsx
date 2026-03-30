import { Center, Card, Heading, VStack } from "@chakra-ui/react";
import { RegisterForm } from "@features/register-by-email";

export const RegisterPage = () => (
  <Center minH="100vh" bg="bg.muted">
    <Card.Root borderRadius="24px" w="full" maxW="md" mx={4} variant="outline">
      <Card.Header pb={0}>
        <VStack align="center" gap={1}>
          <Heading size="xl">Регистрация</Heading>
        </VStack>
      </Card.Header>
      <Card.Body pt={6}>
        <RegisterForm />
      </Card.Body>
    </Card.Root>
  </Center>
);
