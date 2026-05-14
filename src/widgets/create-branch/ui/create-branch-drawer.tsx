import {
  Drawer,
  Portal,
  CloseButton,
  Button,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Form } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { FormField, SelectField } from "@shared/ui";
import { inn as validateInn, kpp as validateKpp } from "@shared/lib";
import { useCreateBranchMutation } from "@entities/branch";
import { useGetRegionalCentersQuery } from "@entities/regional-center";
import type { CreateBranchFormValues } from "../model/types";

const validate = (values: CreateBranchFormValues) => {
  const errors: Partial<Record<keyof CreateBranchFormValues, string>> = {};
  if (!values.code?.trim()) errors.code = "Обязательное поле";
  if (!values.name?.trim()) errors.name = "Обязательное поле";
  if (!values.regional_center_id) errors.regional_center_id = "Обязательное поле";
  errors.inn = validateInn(values.inn ?? "");
  errors.kpp = validateKpp(values.kpp ?? "");
  return errors;
};

interface CreateBranchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateBranchDrawer({
  isOpen,
  onClose,
  onSuccess,
}: CreateBranchDrawerProps) {
  const [createBranch, { isLoading }] = useCreateBranchMutation();
  const { data: centers = [] } = useGetRegionalCentersQuery();

  const centerOptions = centers.map((c) => ({ value: c.id, label: c.name }));

  const handleSubmit = async (values: CreateBranchFormValues) => {
    try {
      await createBranch({
        code: values.code,
        name: values.name,
        regional_center_id: values.regional_center_id,
        ...(values.address?.trim() && { address: values.address }),
        ...(values.inn?.trim() && { inn: values.inn }),
        ...(values.kpp?.trim() && { kpp: values.kpp }),
      }).unwrap();
      onSuccess();
      onClose();
    } catch {
      return { [FORM_ERROR]: "Произошла ошибка. Попробуйте снова." };
    }
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => { if (!e.open) onClose(); }}
      placement="end"
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content maxW="480px">
            <Drawer.Header fontSize="lg" fontWeight="semibold">
              <Drawer.Title>Добавить отделение</Drawer.Title>
            </Drawer.Header>
            <Drawer.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>

            <Form<CreateBranchFormValues>
              onSubmit={handleSubmit}
              validate={validate}
            >
              {({ handleSubmit: submitForm, submitError }) => (
                <form onSubmit={submitForm} style={{ display: "contents" }}>
                  <Drawer.Body>
                    <VStack gap={4} align="stretch">
                      <FormField name="code" label="Код" placeholder="Код отделения" />
                      <FormField name="name" label="Наименование" placeholder="Название отделения" />
                      <SelectField
                        name="regional_center_id"
                        label="Региональный центр"
                        options={centerOptions}
                        placeholder="Выберите региональный центр"
                      />
                      <FormField name="address" label="Адрес" placeholder="Необязательно" />
                      <FormField name="inn" label="ИНН" placeholder="До 12 символов" digitsOnly />
                      <FormField name="kpp" label="КПП" placeholder="До 9 символов" digitsOnly />
                      {submitError && (
                        <Text color="red.500" fontSize="sm">{submitError}</Text>
                      )}
                    </VStack>
                  </Drawer.Body>
                  <Drawer.Footer gap={3}>
                    <Button variant="outline" onClick={onClose}>Отмена</Button>
                    <Button type="submit" colorPalette="brand" loading={isLoading}>
                      Создать
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
