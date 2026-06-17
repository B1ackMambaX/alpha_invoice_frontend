import { useState } from "react";
import type { ColumnDef, SortingState, OnChangeFn } from "@tanstack/react-table";
import {
  Box,
  Flex,
  IconButton,
  Dialog,
  Portal,
  Button,
  Text,
  Badge,
} from "@chakra-ui/react";
import { LuX, LuEye } from "react-icons/lu";
import { MainLayout } from "@widgets/main-layout";
import { DataTable, RefetchButton } from "@shared/ui";
import { useAppSelector } from "@app/providers/store";
import {
  useGetInvoicesInfiniteQuery,
  useReturnInvoiceToDraftMutation,
  type InvoiceListItem,
  type InvoiceFilters,
  type InvoiceStatus,
} from "@entities/invoice";
import { canManageInvoices } from "@entities/session";
import { InvoiceFilters as InvoiceFiltersWidget } from "@widgets/invoice-filters";
import { ViewInvoiceDrawer } from "@widgets/edit-invoice";
import { formatDateTime } from "@shared/lib";
import { FilterChip } from "@features/filter-chip";

type FormattedInvoiceStatus = Extract<InvoiceStatus, "approved" | "sent">;

const STATUS_OPTIONS: { value: FormattedInvoiceStatus; label: string }[] = [
  { value: "approved", label: "Подтверждённые" },
  { value: "sent", label: "Отправленные" },
];

const STATUS_LABELS: Record<FormattedInvoiceStatus, string> = {
  approved: "Подтверждён",
  sent: "Отправлен",
};

const STATUS_COLORS: Record<FormattedInvoiceStatus, "green" | "blue"> = {
  approved: "green",
  sent: "blue",
};

export const FormattedInvoicesPage = () => {
  const user = useAppSelector((state) => state.session.user);
  const canManage = canManageInvoices(user);
  const [filters, setFilters] = useState<Omit<InvoiceFilters, "sort_by" | "sort_order">>({
    status: "sent",
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [cancelItem, setCancelItem] = useState<InvoiceListItem | null>(null);
  const [viewItemId, setViewItemId] = useState<string | null>(null);

  const queryFilters: InvoiceFilters = {
    ...filters,
    ...(sorting[0] && {
      sort_by: sorting[0].id,
      sort_order: sorting[0].desc ? "DESC" : "ASC",
    }),
  };

  const { data, currentData, isFetching, fetchNextPage, hasNextPage, refetch } =
    useGetInvoicesInfiniteQuery(queryFilters);
  const isLoading = isFetching && !currentData;

  const [returnToDraft, { isLoading: isReturning }] = useReturnInvoiceToDraftMutation();

  const handleReturnToDraft = async () => {
    if (!cancelItem) return;
    try {
      await returnToDraft(cancelItem.id).unwrap();
      setCancelItem(null);
    } catch {
      // error is non-critical; dialog stays open
    }
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  const columns: ColumnDef<InvoiceListItem>[] = [
    { accessorKey: "number", header: "Номер", enableSorting: true },
    {
      accessorKey: "invoice_date",
      header: "Дата",
      enableSorting: true,
      cell: ({ getValue }) => formatDateTime(getValue<string>(), "date"),
    },
    { accessorKey: "service_name", header: "Услуга", enableSorting: true },
    { accessorKey: "total_with_vat", header: "Сумма с НДС", enableSorting: true },
    {
      accessorKey: "status",
      header: "Статус",
      enableSorting: true,
      cell: ({ getValue }) => {
        const status = getValue<FormattedInvoiceStatus>();
        return (
          <Badge colorPalette={STATUS_COLORS[status] ?? "gray"}>
            {STATUS_LABELS[status] ?? status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <Flex gap={1} justify="flex-end">
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Просмотр"
            onClick={() => setViewItemId(row.original.id)}
          >
            <LuEye />
          </IconButton>
          {canManage && row.original.status === "approved" && (
            <IconButton
              size="sm"
              variant="ghost"
              colorPalette="red"
              aria-label="Отменить"
              onClick={() => setCancelItem(row.original)}
            >
              <LuX />
            </IconButton>
          )}
        </Flex>
      ),
    },
  ];

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <MainLayout
      title="Оформленные счета-фактуры"
      subtitle={
        <InvoiceFiltersWidget filters={filters} onChange={setFilters}>
            <FilterChip
              label="Статус"
              options={STATUS_OPTIONS}
              value={filters.status as FormattedInvoiceStatus | undefined}
              isClearable={false}
              onChange={(status) =>
                setFilters({ ...filters, status: status ?? "sent" })
              }
            />
        </InvoiceFiltersWidget>
      }
      actions={<RefetchButton onClick={refetch} isFetching={isFetching} />}
      isContentWithoutPadding
    >
      <Box height="100%" display="flex" flexDirection="column">
        <DataTable
          columns={columns}
          data={allItems}
          isLoading={isLoading}
          isFetching={isFetching}
          hasNextPage={hasNextPage ?? false}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortingChange={handleSortingChange}
        />
      </Box>

      {viewItemId && (
        <ViewInvoiceDrawer
          invoiceId={viewItemId}
          isOpen={true}
          onClose={() => setViewItemId(null)}
        />
      )}

      {canManage && (
        <Dialog.Root
          open={!!cancelItem}
          onOpenChange={(e) => {
            if (!e.open) setCancelItem(null);
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Вернуть в черновик?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Text>
                    Счёт-фактура <strong>№{cancelItem?.number}</strong> будет
                    возвращён в статус черновика.
                  </Text>
                </Dialog.Body>
                <Dialog.Footer gap={3}>
                  <Button variant="outline" onClick={() => setCancelItem(null)}>
                    Назад
                  </Button>
                  <Button
                    colorPalette="orange"
                    loading={isReturning}
                    onClick={handleReturnToDraft}
                  >
                    Вернуть в черновик
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      )}
    </MainLayout>
  );
};
