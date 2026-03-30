import { Form } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { Button, VStack, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import { FormField } from "@shared/ui";
import { composeValidators, minLength, required } from "@shared/lib";
import { useLoginMutation } from "@entities/session";
import type { LoginFormValues } from "../model/types";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap();
      void navigate("/");
    } catch {
      return { [FORM_ERROR]: "Неверный логин или пароль" };
    }
  };

  return (
    <Form<LoginFormValues> onSubmit={handleSubmit}>
      {({ handleSubmit, submitError }) => (
        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <FormField
              name="username"
              label="Логин"
              placeholder="Введите логин"
              validate={required}
            />
            <FormField
              name="password"
              label="Пароль"
              type="password"
              placeholder="Введите пароль"
              validate={composeValidators(required, minLength(6))}
            />
            {submitError && (
              <Text color="red.500" fontSize="sm">
                {submitError}
              </Text>
            )}
            <Button
              type="submit"
              size="xl"
              borderRadius="24px"
              colorPalette="brand"
              loading={isLoading}
              w="full"
            >
              Войти
            </Button>
            <Text fontSize="sm" textAlign="center">
              Нет аккаунта?{" "}
              <Link asChild color="blue.500">
                <RouterLink to="/register">Зарегистрироваться</RouterLink>
              </Link>
            </Text>
          </VStack>
        </form>
      )}
    </Form>
  );
};
