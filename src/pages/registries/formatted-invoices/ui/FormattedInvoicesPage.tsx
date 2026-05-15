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
} from "@chakra-ui/react";
import { LuX, LuEye } from "react-icons/lu";
import { MainLayout } from "@widgets/main-layout";
import { DataTable } from "@shared/ui";
import {
  useGetInvoicesInfiniteQuery,
  useCancelInvoiceMutation,
  type InvoiceListItem,
  type InvoiceFilters,
} from "@entities/invoice";
import { InvoiceFilters as InvoiceFiltersWidget } from "@widgets/invoice-filters";
import { ViewInvoiceDrawer } from "@widgets/edit-invoice";
import { formatDateTime } from "@shared/lib";

export const FormattedInvoicesPage = () => {
  const [filters, setFilters] = useState<Omit<InvoiceFilters, "status" | "sort_by" | "sort_order">>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [cancelItem, setCancelItem] = useState<InvoiceListItem | null>(null);
  const [viewItemId, setViewItemId] = useState<string | null>(null);

  const queryFilters: InvoiceFilters = {
    ...filters,
    status: "approved",
    ...(sorting[0] && {
      sort_by: sorting[0].id,
      sort_order: sorting[0].desc ? "DESC" : "ASC",
    }),
  };

  const { data, currentData, isFetching, fetchNextPage, hasNextPage } =
    useGetInvoicesInfiniteQuery(queryFilters);
  const isLoading = isFetching && !currentData;

  const [cancelInvoice, { isLoading: isCancelling }] = useCancelInvoiceMutation();

  const handleCancel = async () => {
    if (!cancelItem) return;
    try {
      await cancelInvoice(cancelItem.id).unwrap();
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
          <IconButton
            size="sm"
            variant="ghost"
            colorPalette="red"
            aria-label="Отменить"
            onClick={() => setCancelItem(row.original)}
          >
            <LuX />
          </IconButton>
        </Flex>
      ),
    },
  ];

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <MainLayout
      title="Оформленные счета-фактуры"
      subtitle={<InvoiceFiltersWidget filters={filters} onChange={setFilters} />}
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
                <Dialog.Title>Отменить счёт-фактуру?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Счёт-фактура <strong>№{cancelItem?.number}</strong> будет
                  отменён. Это действие нельзя отменить.
                </Text>
              </Dialog.Body>
              <Dialog.Footer gap={3}>
                <Button variant="outline" onClick={() => setCancelItem(null)}>
                  Назад
                </Button>
                <Button
                  colorPalette="red"
                  loading={isCancelling}
                  onClick={handleCancel}
                >
                  Отменить счёт
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </MainLayout>
  );
};
