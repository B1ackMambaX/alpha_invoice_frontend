import {
  Drawer,
  Portal,
  CloseButton,
  Button,
  VStack,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import { Form, Field } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { FormField, DatePickerField } from "@shared/ui";
import {
  useCreateStandardLoadMutation,
  useCreateByDateLoadMutation,
  useCreateByAccountLoadMutation,
  LoadType,
} from "@entities/data-load-log";
import type { CreateDataLoadFormValues } from "../model/types";

const validateForm = (values: CreateDataLoadFormValues) => {
  const errors: Partial<Record<keyof CreateDataLoadFormValues, string>> = {};
  if (values.load_type === "by_date" && !values.load_date) {
    errors.load_date = "Обязательное поле";
  }
  if (values.load_type === "by_account") {
    if (!values.account_number?.trim()) {
      errors.account_number = "Обязательное поле";
    } else if (values.account_number.length > 25) {
      errors.account_number = "Максимум 25 символов";
    }
    if (!values.date_from) {
      errors.date_from = "Обязательное поле";
    }
  }
  return errors;
};

interface CreateDataLoadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateDataLoadDrawer({
  isOpen,
  onClose,
  onSuccess,
}: CreateDataLoadDrawerProps) {
  const [createStandard, { isLoading: isStandardLoading }] =
    useCreateStandardLoadMutation();
  const [createByDate, { isLoading: isByDateLoading }] =
    useCreateByDateLoadMutation();
  const [createByAccount, { isLoading: isByAccountLoading }] =
    useCreateByAccountLoadMutation();

  const isLoading = isStandardLoading || isByDateLoading || isByAccountLoading;

  const handleSubmit = async (values: CreateDataLoadFormValues) => {
    try {
      if (values.load_type === "standard") {
        await createStandard().unwrap();
      } else if (values.load_type === "by_date") {
        await createByDate({ load_date: values.load_date! }).unwrap();
      } else {
        await createByAccount({
          account_number: values.account_number!,
          date_from: values.date_from!,
        }).unwrap();
      }
      onSuccess();
      onClose();
    } catch {
      return { [FORM_ERROR]: "Произошла ошибка. Попробуйте снова." };
    }
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="end"
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content maxW="480px">
            <Drawer.Header fontSize="lg" fontWeight="semibold">
              <Drawer.Title>Загрузить из АБС</Drawer.Title>
            </Drawer.Header>
            <Drawer.CloseTrigger
              asChild
              position="absolute"
              top="3"
              insetEnd="3"
            >
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>

            <Form<CreateDataLoadFormValues>
              onSubmit={handleSubmit}
              initialValues={{ load_type: LoadType.STANDARD }}
              validate={validateForm}
            >
              {({ handleSubmit: submitForm, values, submitError }) => (
                <form onSubmit={submitForm} style={{ display: "contents" }}>
                  <Drawer.Body>
                    <VStack gap={4} align="stretch">
                      <Field name="load_type">
                        {({ input }) => (
                          <RadioGroup.Root
                            colorPalette="brand"
                            value={input.value}
                            onValueChange={(e) => input.onChange(e.value)}
                          >
                            <VStack align="start" gap={3}>
                              {(
                                [
                                  { value: "standard", label: "Стандартная" },
                                  { value: "by_date", label: "По дате" },
                                  { value: "by_account", label: "По счёту" },
                                ] as const
                              ).map((opt) => (
                                <RadioGroup.Item
                                  key={opt.value}
                                  value={opt.value}
                                >
                                  <RadioGroup.ItemHiddenInput />
                                  <RadioGroup.ItemIndicator />
                                  <RadioGroup.ItemText>
                                    {opt.label}
                                  </RadioGroup.ItemText>
                                </RadioGroup.Item>
                              ))}
                            </VStack>
                          </RadioGroup.Root>
                        )}
                      </Field>

                      {values!.load_type === "by_date" && (
                        <DatePickerField
                          name="load_date"
                          label="Дата загрузки"
                        />
                      )}

                      {values!.load_type === "by_account" && (
                        <>
                          <FormField
                            name="account_number"
                            label="Номер счёта"
                            placeholder="До 25 символов"
                          />
                          <DatePickerField
                            name="date_from"
                            label="Дата начала"
                          />
                        </>
                      )}

                      {submitError && (
                        <Text color="red.500" fontSize="sm">
                          {submitError}
                        </Text>
                      )}
                    </VStack>
                  </Drawer.Body>

                  <Drawer.Footer gap={3}>
                    <Button variant="outline" onClick={onClose}>
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      colorPalette="brand"
                      loading={isLoading}
                    >
                      Загрузить
                    </Button>
                  </Drawer.Footer>
                </form>
              )}
            </Form>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
