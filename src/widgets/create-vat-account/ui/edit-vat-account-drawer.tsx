import {
  Drawer,
  Portal,
  CloseButton,
  Button,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Form } from "react-final-form";
import { useFormState } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { FormField, SelectField } from "@shared/ui";
import { accountNumber } from "@shared/lib";
import { useUpdateVatAccountMutation, type VatAccountItem } from "@entities/vat-account";
import { useGetRegionalCentersQuery } from "@entities/regional-center";
import { useGetBranchesQuery } from "@entities/branch";
import type { EditVatAccountFormValues } from "../model/edit-types";

const validate = (values: EditVatAccountFormValues) => {
  const errors: Partial<Record<keyof EditVatAccountFormValues, string>> = {};
  errors.account_number = accountNumber(values.account_number ?? "");
  if (!values.name?.trim()) errors.name = "Обязательное поле";
  if (!values.regional_center_id) errors.regional_center_id = "Обязательное поле";
  if (!values.branch_id) errors.branch_id = "Обязательное поле";
  return errors;
};

function BranchSelect() {
  const { values } = useFormState<EditVatAccountFormValues>({
    subscription: { values: true },
  });
  const regionalCenterId = values?.regional_center_id;
  const { data: branches = [] } = useGetBranchesQuery(
    { regional_center_id: regionalCenterId },
    { skip: !regionalCenterId }
  );
  const branchOptions = branches.map((b) => ({ value: b.id, label: b.name }));

  return (
    <SelectField
      name="branch_id"
      label="Отделение"
      options={branchOptions}
      placeholder={regionalCenterId ? "Выберите отделение" : "Сначала выберите РЦ"}
    />
  );
}

interface EditVatAccountDrawerProps {
  item: VatAccountItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditVatAccountDrawer({
  item,
  isOpen,
  onClose,
  onSuccess,
}: EditVatAccountDrawerProps) {
  const [updateVatAccount, { isLoading }] = useUpdateVatAccountMutation();
  const { data: centers = [] } = useGetRegionalCentersQuery();

  const centerOptions = centers.map((c) => ({ value: c.id, label: c.name }));

  const initialValues: EditVatAccountFormValues = {
    account_number: item.account_number,
    name: item.name,
    regional_center_id: item.regional_center_id,
    branch_id: item.branch_id,
  };

  const handleSubmit = async (values: EditVatAccountFormValues) => {
    try {
      await updateVatAccount({ id: item.id, data: values }).unwrap();
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
              <Drawer.Title>Редактировать счёт НДС</Drawer.Title>
            </Drawer.Header>
            <Drawer.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>

            <Form<EditVatAccountFormValues>
              onSubmit={handleSubmit}
              initialValues={initialValues}
              validate={validate}
            >
              {({ handleSubmit: submitForm, submitError }) => (
                <form onSubmit={submitForm} style={{ display: "contents" }}>
                  <Drawer.Body>
                    <VStack gap={4} align="stretch">
                      <FormField
                        name="account_number"
                        label="Номер счёта"
                        placeholder="Номер счёта НДС"
                        digitsOnly
                      />
                      <FormField
                        name="name"
                        label="Наименование"
                        placeholder="Название счёта"
                      />
                      <SelectField
                        name="regional_center_id"
                        label="Региональный центр"
                        options={centerOptions}
                        placeholder="Выберите региональный центр"
                      />
                      <BranchSelect />
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
