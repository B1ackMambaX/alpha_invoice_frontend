import { Form } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { Button, VStack, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import { FormField } from "@shared/ui";
import { composeValidators, isEmail, minLength, required } from "@shared/lib";
import { useRegisterMutation } from "@entities/session";
import type { RegisterFormValues } from "../model/types";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values).unwrap();
      void navigate("/login");
    } catch {
      return {
        [FORM_ERROR]:
          "Ошибка регистрации. Возможно, пользователь уже существует",
      };
    }
  };

  return (
    <Form<RegisterFormValues> onSubmit={handleSubmit}>
      {({ handleSubmit, submitError }) => (
        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <FormField
              name="full_name"
              label="Полное имя"
              placeholder="Иван Иванов"
              validate={required}
            />
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="example@mail.com"
              validate={composeValidators(required, isEmail)}
            />
            <FormField
              name="username"
              label="Логин"
              placeholder="Введите логин"
              validate={composeValidators(required, minLength(3))}
            />
            <FormField
              name="password"
              label="Пароль"
              type="password"
              placeholder="Минимум 6 символов"
              validate={composeValidators(required, minLength(6))}
            />
            {submitError && (
              <Text color="red.500" fontSize="sm">
                {submitError}
              </Text>
            )}
            <Button
              size="xl"
              borderRadius="24px"
              type="submit"
              colorPalette="brand"
              loading={isLoading}
              w="full"
            >
              Зарегистрироваться
            </Button>
            <Text fontSize="sm" textAlign="center">
              Уже есть аккаунт?{" "}
              <Link asChild color="blue.500">
                <RouterLink to="/login">Войти</RouterLink>
              </Link>
            </Text>
          </VStack>
        </form>
      )}
    </Form>
  );
};
