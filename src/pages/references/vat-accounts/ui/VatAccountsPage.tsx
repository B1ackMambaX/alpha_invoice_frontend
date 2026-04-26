import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Box, Flex, IconButton, Dialog, Portal, Button, Text } from "@chakra-ui/react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { MainLayout } from "@widgets/main-layout";
import { DataTable } from "@shared/ui";
import {
  useGetVatAccountsInfiniteQuery,
  useDeleteVatAccountMutation,
  type VatAccountItem,
  type VatAccountFilters,
} from "@entities/vat-account";
import { VatAccountsFilters } from "@widgets/vat-accounts-filters";
import {
  CreateVatAccountButton,
  EditVatAccountDrawer,
} from "@widgets/create-vat-account";

export const VatAccountsPage = () => {
  const [filters, setFilters] = useState<VatAccountFilters>({});
  const [editItem, setEditItem] = useState<VatAccountItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<VatAccountItem | null>(null);

  const { data, isFetching, fetchNextPage, hasNextPage, refetch } =
    useGetVatAccountsInfiniteQuery(filters);

  const [deleteVatAccount, { isLoading: isDeleting }] = useDeleteVatAccountMutation();

  const handleDelete = async () => {
    if (!deleteItem) return;
    await deleteVatAccount(deleteItem.id).unwrap();
    setDeleteItem(null);
    refetch();
  };

  const columns: ColumnDef<VatAccountItem>[] = [
    { accessorKey: "account_number", header: "Номер счёта" },
    { accessorKey: "name",           header: "Наименование" },
    { accessorKey: "created_at",     header: "Дата создания" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Flex gap={1} justify="flex-end">
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Редактировать"
            onClick={() => setEditItem(row.original)}
          >
            <LuPencil />
          </IconButton>
          <IconButton
            size="sm"
            variant="ghost"
            colorPalette="red"
            aria-label="Удалить"
            onClick={() => setDeleteItem(row.original)}
          >
            <LuTrash2 />
          </IconButton>
        </Flex>
      ),
    },
  ];

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <MainLayout
      title="Счета по учетам НДС"
      subtitle={<VatAccountsFilters filters={filters} onChange={setFilters} />}
      actions={<CreateVatAccountButton onSuccess={refetch} />}
    >
      <Box height="100%" display="flex" flexDirection="column">
        <DataTable
          columns={columns}
          data={allItems}
          isFetching={isFetching}
          hasNextPage={hasNextPage ?? false}
          onFetchNextPage={fetchNextPage}
        />
      </Box>

      {editItem && (
        <EditVatAccountDrawer
          item={editItem}
          isOpen={true}
          onClose={() => setEditItem(null)}
          onSuccess={refetch}
        />
      )}

      <Dialog.Root
        open={!!deleteItem}
        onOpenChange={(e) => { if (!e.open) setDeleteItem(null); }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Удалить счёт?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Счёт <strong>{deleteItem?.account_number}</strong> будет удалён без возможности восстановления.
                </Text>
              </Dialog.Body>
              <Dialog.Footer gap={3}>
                <Button variant="outline" onClick={() => setDeleteItem(null)}>
                  Отмена
                </Button>
                <Button
                  colorPalette="red"
                  loading={isDeleting}
                  onClick={handleDelete}
                >
                  Удалить
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </MainLayout>
  );
};
