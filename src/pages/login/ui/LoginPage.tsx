import { Center, Card, Heading, VStack } from '@chakra-ui/react'
import { LoginForm } from '@features/auth-by-username'

export const LoginPage = () => (
  <Center minH="100vh" bg="gray.50">
    <Card.Root w="full" maxW="md" mx={4} boxShadow="lg">
      <Card.Header pb={0}>
        <VStack align="start" gap={1}>
          <Heading size="xl">Вход</Heading>
        </VStack>
      </Card.Header>
      <Card.Body pt={6}>
        <LoginForm />
      </Card.Body>
    </Card.Root>
  </Center>
)
