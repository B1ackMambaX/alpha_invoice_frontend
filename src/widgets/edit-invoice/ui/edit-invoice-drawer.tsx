import { useState, useMemo, useRef } from "react";
import {
  Drawer,
  Portal,
  CloseButton,
  Button,
  VStack,
  Text,
  Spinner,
  Flex,
  Grid,
  Separator,
  Badge,
  Menu,
  Input,
  Box,
  FieldRoot,
  FieldLabel,
} from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { FormField, SelectField, DatePickerField } from "@shared/ui";
import {
  useGetInvoiceQuery,
  useUpdateInvoiceMutation,
  type InvoiceDetail,
  type InvoiceUpdate,
} from "@entities/invoice";
import {
  useGetCounterpartiesQuery,
  type CounterpartyItem,
} from "@entities/counterparty";
import { useGetBranchesQuery } from "@entities/branch";
import { useGetRegionalCentersQuery } from "@entities/regional-center";
import { formatDateTime } from "@shared/lib";
import type { EditInvoiceFormValues } from "../model/types";

const BOOL_OPTIONS = [
  { value: "true", label: "Да" },
  { value: "false", label: "Нет" },
];

const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  approved: "Подтверждён",
  cancelled: "Отменён",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "orange",
  approved: "green",
  cancelled: "red",
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <Text fontSize="sm" color="fg.muted" alignSelf="center">
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="medium" alignSelf="center">
        {value ?? "—"}
      </Text>
    </>
  );
}

function formatAmount(value: string | null | undefined) {
  if (!value) return "—";
  return parseFloat(value).toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function CounterpartyCombobox({
  counterparties,
}: {
  counterparties: CounterpartyItem[];
}) {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(() => {
    if (!search.trim()) return counterparties;
    const lower = search.toLowerCase();
    return counterparties.filter(
      (c) =>
        c.short_name?.toLowerCase().includes(lower) ||
        c.full_name.toLowerCase().includes(lower) ||
        c.inn.includes(lower),
    );
  }, [counterparties, search]);

  return (
    <Field name="counterparty_id">
      {({ input }) => {
        const selected = counterparties.find((c) => c.id === input.value);
        return (
          <FieldRoot>
            <FieldLabel fontSize="sm" fontWeight="medium">
              Контрагент
            </FieldLabel>
            <Menu.Root
              onOpenChange={(e) => {
                if (e.open) {
                  setSearch("");
                  setTimeout(() => searchRef.current?.focus(), 50);
                } else {
                  input.onBlur();
                }
              }}
            >
              <Menu.Trigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  w="100%"
                  h="10"
                  px="3"
                  borderRadius="16px"
                  borderColor="border"
                  bg="transparent"
                  justifyContent="space-between"
                >
                  <Text fontSize="sm" color={selected ? "fg" : "fg.subtle"} truncate>
                    {selected
                      ? `${selected.short_name ?? selected.full_name} (ИНН ${selected.inn})`
                      : "Выберите контрагента"}
                  </Text>
                  <LuChevronDown />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner width="var(--reference-width)">
                  <Menu.Content maxH="280px" overflowY="auto">
                    <Box
                      px={2}
                      py={2}
                      position="sticky"
                      top={0}
                      bg="bg"
                      zIndex={1}
                      borderBottomWidth="1px"
                    >
                      <Input
                        ref={searchRef}
                        size="sm"
                        placeholder="Поиск по наименованию или ИНН..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </Box>
                    {visible.length === 0 ? (
                      <Box px={3} py={2} fontSize="sm" color="fg.muted">
                        Контрагенты не найдены
                      </Box>
                    ) : (
                      visible.map((c) => (
                        <Menu.Item
                          key={c.id}
                          value={c.id}
                          fontWeight={input.value === c.id ? "semibold" : "normal"}
                          onClick={() => input.onChange(c.id)}
                        >
                          <Box>
                            <Text fontSize="sm">
                              {c.short_name ?? c.full_name}
                            </Text>
                            <Text fontSize="xs" color="fg.muted">
                              ИНН {c.inn}
                              {c.kpp ? ` / КПП ${c.kpp}` : ""}
                            </Text>
                          </Box>
                        </Menu.Item>
                      ))
                    )}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </FieldRoot>
        );
      }}
    </Field>
  );
}

function InvoiceInfo({ invoice }: { invoice: InvoiceDetail }) {
  const { data: branches = [] } = useGetBranchesQuery({});
  const { data: centers = [] } = useGetRegionalCentersQuery();

  const branch = branches.find((b) => b.id === invoice.branch_id);
  const center = centers.find((c) => c.id === invoice.regional_center_id);

  return (
    <Grid templateColumns="1fr 1fr" gap={3} mb={1}>
      <InfoRow label="Номер" value={invoice.number} />
      <InfoRow
        label="Дата счёта"
        value={formatDateTime(invoice.invoice_date, "date")}
      />
      <InfoRow
        label="Статус"
        value={
          <Badge colorPalette={STATUS_COLORS[invoice.status] ?? "gray"} size="sm">
            {STATUS_LABELS[invoice.status] ?? invoice.status}
          </Badge>
        }
      />
      <InfoRow label="Валюта" value={invoice.currency_code} />
      <InfoRow label="Страна" value={invoice.country_code} />
      <InfoRow label="Отделение" value={branch?.name} />
      <InfoRow label="Региональный центр" value={center?.name} />
      <InfoRow label="Сумма без НДС" value={formatAmount(invoice.total_amount)} />
      <InfoRow label="Сумма НДС" value={formatAmount(invoice.vat_amount)} />
      <InfoRow label="Итого с НДС" value={formatAmount(invoice.total_with_vat)} />
      <InfoRow
        label="Отправлен"
        value={invoice.sent_at ? formatDateTime(invoice.sent_at, "full") : null}
      />
      <InfoRow
        label="Создан"
        value={formatDateTime(invoice.created_at, "full")}
      />
      <InfoRow
        label="Обновлён"
        value={formatDateTime(invoice.updated_at, "full")}
      />
    </Grid>
  );
}

interface EditInvoiceDrawerProps {
  invoiceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EditInvoiceDrawer({
  invoiceId,
  isOpen,
  onClose,
}: EditInvoiceDrawerProps) {
  const { data: invoice, isLoading: isLoadingDetail } = useGetInvoiceQuery(invoiceId);
  const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation();
  const { data: counterpartiesData } = useGetCounterpartiesQuery();
  const counterparties = counterpartiesData?.items ?? [];

  const initialValues: EditInvoiceFormValues | undefined = invoice
    ? {
        counterparty_id: invoice.counterparty_id ?? "",
        service_name: invoice.service_name ?? "",
        service_code: invoice.service_code ?? "",
        unit_name: invoice.unit_name ?? "",
        quantity: invoice.quantity ?? "",
        price: invoice.price ?? "",
        vat_rate: invoice.vat_rate ?? "",
        special_sales_book: invoice.special_sales_book ? "true" : "false",
        inter_price_difference: invoice.inter_price_difference ? "true" : "false",
        correction_number: invoice.correction_number ?? "",
        payment_document_number: invoice.payment_document_number ?? "",
        payment_date: invoice.payment_date ?? "",
      }
    : undefined;

  const handleSubmit = async (values: EditInvoiceFormValues) => {
    try {
      const patch: InvoiceUpdate = {
        ...(values.counterparty_id && { counterparty_id: values.counterparty_id }),
        ...(values.service_name && { service_name: values.service_name }),
        ...(values.service_code && { service_code: values.service_code }),
        ...(values.unit_name && { unit_name: values.unit_name }),
        ...(values.quantity !== "" && { quantity: parseFloat(values.quantity) }),
        ...(values.price !== "" && { price: parseFloat(values.price) }),
        ...(values.vat_rate !== "" && { vat_rate: parseFloat(values.vat_rate) }),
        special_sales_book: values.special_sales_book === "true",
        inter_price_difference: values.inter_price_difference === "true",
        ...(values.correction_number && { correction_number: values.correction_number }),
        ...(values.payment_document_number && { payment_document_number: values.payment_document_number }),
        ...(values.payment_date && { payment_date: values.payment_date }),
      };

      await updateInvoice({ id: invoiceId, data: patch }).unwrap();
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
          <Drawer.Content maxW="560px">
            <Drawer.Header fontSize="lg" fontWeight="semibold">
              <Drawer.Title>
                {invoice ? `Счёт-фактура №${invoice.number}` : "Счёт-фактура"}
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>

            {isLoadingDetail || !initialValues || !invoice ? (
              <Drawer.Body>
                <Flex justify="center" align="center" h="200px">
                  <Spinner color="brand" size="lg" />
                </Flex>
              </Drawer.Body>
            ) : (
              <Form<EditInvoiceFormValues>
                onSubmit={handleSubmit}
                initialValues={initialValues}
              >
                {({ handleSubmit: submitForm, submitError }) => (
                  <form onSubmit={submitForm} style={{ display: "contents" }}>
                    <Drawer.Body>
                      <VStack gap={4} align="stretch">
                        <InvoiceInfo invoice={invoice} />

                        <Separator />

                        <Text fontSize="sm" fontWeight="semibold" color="fg.muted">
                          Редактируемые поля
                        </Text>

                        <CounterpartyCombobox counterparties={counterparties} />

                        <FormField
                          name="service_name"
                          label="Наименование услуги"
                          placeholder="Наименование"
                        />
                        <FormField
                          name="service_code"
                          label="Код услуги"
                          placeholder="Код"
                        />
                        <FormField
                          name="unit_name"
                          label="Единица измерения"
                          placeholder="шт, кг..."
                        />
                        <Grid templateColumns="1fr 1fr" gap={3}>
                          <FormField
                            name="quantity"
                            label="Количество"
                            placeholder="0"
                            type="number"
                          />
                          <FormField
                            name="price"
                            label="Цена"
                            placeholder="0.00"
                            type="number"
                          />
                        </Grid>
                        <FormField
                          name="vat_rate"
                          label="Ставка НДС, %"
                          type="number"
                          min={0}
                          max={100}
                          placeholder="0–100"
                        />
                        <Grid templateColumns="1fr 1fr" gap={3}>
                          <SelectField
                            name="special_sales_book"
                            label="Спец. книга продаж"
                            options={BOOL_OPTIONS}
                          />
                          <SelectField
                            name="inter_price_difference"
                            label="Межценовая разница"
                            options={BOOL_OPTIONS}
                          />
                        </Grid>
                        <FormField
                          name="correction_number"
                          label="Номер корректировки"
                        />
                        <FormField
                          name="payment_document_number"
                          label="Номер платёжного документа"
                        />
                        <DatePickerField name="payment_date" label="Дата платежа" />

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
                      <Button type="submit" colorPalette="brand" loading={isUpdating}>
                        Сохранить
                      </Button>
                    </Drawer.Footer>
                  </form>
                )}
              </Form>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
