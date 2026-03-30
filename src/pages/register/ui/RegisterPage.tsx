import { Center, Card, Heading, VStack } from '@chakra-ui/react'
import { RegisterForm } from '@features/register-by-email'

export const RegisterPage = () => (
  <Center minH="100vh" bg="gray.50">
    <Card.Root w="full" maxW="md" mx={4} boxShadow="lg">
      <Card.Header pb={0}>
        <VStack align="start" gap={1}>
          <Heading size="xl">Регистрация</Heading>
        </VStack>
      </Card.Header>
      <Card.Body pt={6}>
        <RegisterForm />
      </Card.Body>
    </Card.Root>
  </Center>
)
