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
import { FormField, SelectField, UserComboboxField } from "@shared/ui";
import { useUpdateResponsibleMutation, type ResponsibleItem } from "@entities/responsible";
import { useGetRegionalCentersQuery } from "@entities/regional-center";
import { useGetUsersQuery } from "@entities/user";
import type { CreateResponsibleFormValues } from "../model/types";

const validate = (values: CreateResponsibleFormValues) => {
  const errors: Partial<Record<keyof CreateResponsibleFormValues, string>> = {};
  if (!values.user_id) errors.user_id = "Обязательное поле";
  if (!values.regional_center_id) errors.regional_center_id = "Обязательное поле";
  return errors;
};

interface EditResponsibleDrawerProps {
  item: ResponsibleItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditResponsibleDrawer({
  item,
  isOpen,
  onClose,
  onSuccess,
}: EditResponsibleDrawerProps) {
  const [updateResponsible, { isLoading }] = useUpdateResponsibleMutation();
  const { data: centers = [] } = useGetRegionalCentersQuery();
  const { data: users = [] } = useGetUsersQuery();

  const centerOptions = centers.map((c) => ({ value: c.id, label: c.name }));

  const initialValues: CreateResponsibleFormValues = {
    user_id: item.user_id,
    regional_center_id: item.regional_center_id,
    department: item.department ?? "",
  };

  const handleSubmit = async (values: CreateResponsibleFormValues) => {
    try {
      await updateResponsible({
        id: item.id,
        data: {
          user_id: values.user_id,
          regional_center_id: values.regional_center_id,
          department: values.department || null,
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
              <Drawer.Title>Редактировать ответственного</Drawer.Title>
            </Drawer.Header>
            <Drawer.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>

            <Form<CreateResponsibleFormValues>
              onSubmit={handleSubmit}
              initialValues={initialValues}
              validate={validate}
            >
              {({ handleSubmit: submitForm, submitError }) => (
                <form onSubmit={submitForm} style={{ display: "contents" }}>
                  <Drawer.Body>
                    <VStack gap={4} align="stretch">
                      <UserComboboxField
                        name="user_id"
                        label="Пользователь"
                        users={users}
                      />
                      <SelectField
                        name="regional_center_id"
                        label="Региональный центр"
                        options={centerOptions}
                        placeholder="Выберите региональный центр"
                      />
                      <FormField
                        name="department"
                        label="Отдел"
                        placeholder="Название отдела (необязательно)"
                      />
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
