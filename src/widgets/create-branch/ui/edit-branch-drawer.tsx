import {
  Drawer,
  Portal,
  CloseButton,
  Button,
  VStack,
  Text,
  Switch,
  Flex,
} from "@chakra-ui/react";
import { Form, Field } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { FormField, SelectField } from "@shared/ui";
import { inn as validateInn, kpp as validateKpp } from "@shared/lib";
import { useUpdateBranchMutation, type BranchItem } from "@entities/branch";
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

interface EditBranchDrawerProps {
  item: BranchItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditBranchDrawer({ item, isOpen, onClose, onSuccess }: EditBranchDrawerProps) {
  const [updateBranch, { isLoading }] = useUpdateBranchMutation();
  const { data: centers = [] } = useGetRegionalCentersQuery();

  const centerOptions = centers.map((c) => ({ value: c.id, label: c.name }));

  const initialValues: CreateBranchFormValues = {
    code: item.code,
    name: item.name,
    address: item.address ?? "",
    inn: item.inn ?? "",
    kpp: item.kpp ?? "",
    regional_center_id: item.regional_center_id,
    auto_confirm: item.auto_confirm,
  };

  const handleSubmit = async (values: CreateBranchFormValues) => {
    try {
      await updateBranch({
        id: item.id,
        data: {
          code: values.code,
          name: values.name,
          regional_center_id: values.regional_center_id,
          auto_confirm: values.auto_confirm ?? false,
          address: values.address?.trim() || null,
          inn: values.inn?.trim() || null,
          kpp: values.kpp?.trim() || null,
        },
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
              <Drawer.Title>Редактировать отделение</Drawer.Title>
            </Drawer.Header>
            <Drawer.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>

            <Form<CreateBranchFormValues>
              onSubmit={handleSubmit}
              validate={validate}
              initialValues={initialValues}
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
                      <Field name="auto_confirm" type="checkbox">
                        {({ input }) => (
                          <Flex align="center" gap={3}>
                            <Switch.Root
                              checked={input.checked}
                              onCheckedChange={({ checked }) => input.onChange(checked)}
                            >
                              <Switch.HiddenInput />
                              <Switch.Control />
                              <Switch.Label>Автоподтверждение</Switch.Label>
                            </Switch.Root>
                          </Flex>
                        )}
                      </Field>
                      {submitError && (
                        <Text color="red.500" fontSize="sm">{submitError}</Text>
                      )}
                    </VStack>
                  </Drawer.Body>
                  <Drawer.Footer gap={3}>
                    <Button variant="outline" onClick={onClose}>Отмена</Button>
                    <Button type="submit" colorPalette="brand" loading={isLoading}>
                      Сохранить
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
