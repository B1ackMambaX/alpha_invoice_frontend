import {
  Drawer,
  Portal,
  CloseButton,
  Button,
  Spinner,
  Flex,
  Grid,
  Text,
  Badge,
  Separator,
} from "@chakra-ui/react";
import { useGetInvoiceQuery } from "@entities/invoice";
import { useGetCounterpartiesQuery } from "@entities/counterparty";
import { useGetBranchesQuery } from "@entities/branch";
import { useGetRegionalCentersQuery } from "@entities/regional-center";
import { formatDateTime } from "@shared/lib";

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

function formatAmount(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  return parseFloat(String(value)).toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface ViewInvoiceDrawerProps {
  invoiceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewInvoiceDrawer({ invoiceId, isOpen, onClose }: ViewInvoiceDrawerProps) {
  const { data: invoice, isLoading } = useGetInvoiceQuery(invoiceId);
  const { data: counterpartiesData } = useGetCounterpartiesQuery();
  const { data: branches = [] } = useGetBranchesQuery({});
  const { data: centers = [] } = useGetRegionalCentersQuery();

  const counterparty = counterpartiesData?.items.find(
    (c) => c.id === invoice?.counterparty_id,
  );
  const branch = branches.find((b) => b.id === invoice?.branch_id);
  const center = centers.find((c) => c.id === invoice?.regional_center_id);

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

            {isLoading || !invoice ? (
              <Drawer.Body>
                <Flex justify="center" align="center" h="200px">
                  <Spinner color="brand" size="lg" />
                </Flex>
              </Drawer.Body>
            ) : (
              <Drawer.Body>
                <Grid templateColumns="1fr 1fr" gap={3}>
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
                  <InfoRow label="Создан" value={formatDateTime(invoice.created_at, "full")} />
                  <InfoRow label="Обновлён" value={formatDateTime(invoice.updated_at, "full")} />
                </Grid>

                <Separator my={4} />

                <Grid templateColumns="1fr 1fr" gap={3}>
                  <InfoRow
                    label="Контрагент"
                    value={
                      counterparty
                        ? `${counterparty.short_name ?? counterparty.full_name} (ИНН ${counterparty.inn})`
                        : null
                    }
                  />
                  <InfoRow label="Наименование услуги" value={invoice.service_name} />
                  <InfoRow label="Код услуги" value={invoice.service_code} />
                  <InfoRow label="Единица измерения" value={invoice.unit_name} />
                  <InfoRow label="Количество" value={invoice.quantity} />
                  <InfoRow label="Цена" value={formatAmount(invoice.price)} />
                  <InfoRow label="Ставка НДС, %" value={invoice.vat_rate} />
                  <InfoRow
                    label="Спец. книга продаж"
                    value={invoice.special_sales_book ? "Да" : "Нет"}
                  />
                  <InfoRow
                    label="Межценовая разница"
                    value={invoice.inter_price_difference ? "Да" : "Нет"}
                  />
                  <InfoRow label="Номер корректировки" value={invoice.correction_number} />
                  <InfoRow
                    label="Номер платёжного документа"
                    value={invoice.payment_document_number}
                  />
                  <InfoRow
                    label="Дата платежа"
                    value={
                      invoice.payment_date
                        ? formatDateTime(invoice.payment_date, "date")
                        : null
                    }
                  />
                </Grid>
              </Drawer.Body>
            )}

            <Drawer.Footer>
              <Button variant="outline" onClick={onClose}>
                Закрыть
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
