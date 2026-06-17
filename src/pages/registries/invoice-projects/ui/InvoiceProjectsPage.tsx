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
import { LuPencil, LuCheck, LuEye } from "react-icons/lu";
import { MainLayout } from "@widgets/main-layout";
import { DataTable } from "@shared/ui";
import { useAppSelector } from "@app/providers/store";
import {
  useGetInvoicesInfiniteQuery,
  useApproveInvoiceMutation,
  type InvoiceListItem,
  type InvoiceFilters,
} from "@entities/invoice";
import { canManageInvoices } from "@entities/session";
import { InvoiceFilters as InvoiceFiltersWidget } from "@widgets/invoice-filters";
import { EditInvoiceDrawer, ViewInvoiceDrawer } from "@widgets/edit-invoice";
import { formatDateTime } from "@shared/lib";

export const InvoiceProjectsPage = () => {
  const user = useAppSelector((state) => state.session.user);
  const canManage = canManageInvoices(user);
  const [filters, setFilters] = useState<Omit<InvoiceFilters, "status" | "sort_by" | "sort_order">>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [viewItemId, setViewItemId] = useState<string | null>(null);
  const [confirmItem, setConfirmItem] = useState<InvoiceListItem | null>(null);

  const queryFilters: InvoiceFilters = {
    ...filters,
    status: "draft",
    ...(sorting[0] && {
      sort_by: sorting[0].id,
      sort_order: sorting[0].desc ? "DESC" : "ASC",
    }),
  };

  const { data, currentData, isFetching, fetchNextPage, hasNextPage } =
    useGetInvoicesInfiniteQuery(queryFilters);
  const isLoading = isFetching && !currentData;

  const [approveInvoice, { isLoading: isApproving }] = useApproveInvoiceMutation();

  const handleApprove = async () => {
    if (!confirmItem) return;
    try {
      await approveInvoice(confirmItem.id).unwrap();
      setConfirmItem(null);
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
          {canManage ? (
            <>
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="Редактировать"
                  onClick={() => setEditItemId(row.original.id)}
                >
                  <LuPencil />
                </IconButton>
                <IconButton
                  size="sm"
                  variant="ghost"
                  colorPalette="green"
                  aria-label="Подтвердить"
                  onClick={() => setConfirmItem(row.original)}
                >
                  <LuCheck />
                </IconButton>
              </>
            ) : (
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="Просмотр"
                onClick={() => setViewItemId(row.original.id)}
              >
                <LuEye />
              </IconButton>
            )}
        </Flex>
      ),
    },
  ];

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <MainLayout
      title="Проекты счетов-фактур"
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

      {canManage && editItemId && (
        <EditInvoiceDrawer
          invoiceId={editItemId}
          isOpen={true}
          onClose={() => setEditItemId(null)}
        />
      )}

      {!canManage && viewItemId && (
        <ViewInvoiceDrawer
          invoiceId={viewItemId}
          isOpen={true}
          onClose={() => setViewItemId(null)}
        />
      )}

      {canManage && (
        <Dialog.Root
          open={!!confirmItem}
          onOpenChange={(e) => {
            if (!e.open) setConfirmItem(null);
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Подтвердить счёт-фактуру?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Text>
                    Счёт-фактура <strong>№{confirmItem?.number}</strong> будет
                    переведён в статус «Подтверждён» и перемещён в реестр
                    оформленных счетов.
                  </Text>
                </Dialog.Body>
                <Dialog.Footer gap={3}>
                  <Button variant="outline" onClick={() => setConfirmItem(null)}>
                    Отмена
                  </Button>
                  <Button
                    colorPalette="green"
                    loading={isApproving}
                    onClick={handleApprove}
                  >
                    Подтвердить
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
