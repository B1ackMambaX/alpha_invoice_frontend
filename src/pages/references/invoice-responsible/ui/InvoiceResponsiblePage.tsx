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
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { MainLayout } from "@widgets/main-layout";
import { DataTable, RefetchButton } from "@shared/ui";
import {
  useGetResponsiblesInfiniteQuery,
  useDeleteResponsibleMutation,
  type ResponsibleItem,
  type ResponsibleFilters,
} from "@entities/responsible";
import { ResponsibleFiltersBar } from "@widgets/responsible-filters";
import {
  CreateResponsibleButton,
  EditResponsibleDrawer,
} from "@widgets/create-responsible";
import { formatDateTime } from "@shared/lib";

export const InvoiceResponsiblePage = () => {
  const [filters, setFilters] = useState<Omit<ResponsibleFilters, "sort_by" | "sort_order">>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editItem, setEditItem] = useState<ResponsibleItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ResponsibleItem | null>(null);

  const queryFilters: ResponsibleFilters = {
    ...filters,
    ...(sorting[0] && { sort_by: sorting[0].id, sort_order: sorting[0].desc ? "DESC" : "ASC" }),
  };

  const { data, currentData, isFetching, fetchNextPage, hasNextPage, refetch } =
    useGetResponsiblesInfiniteQuery(queryFilters);
  const isLoading = isFetching && !currentData;

  const [deleteResponsible, { isLoading: isDeleting }] =
    useDeleteResponsibleMutation();

  const handleDelete = async () => {
    if (!deleteItem) return;
    await deleteResponsible(deleteItem.id).unwrap();
    setDeleteItem(null);
    refetch();
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  const columns: ColumnDef<ResponsibleItem>[] = [
    { accessorKey: "user.username", header: "Имя пользователя", enableSorting: true },
    { accessorKey: "user.full_name", header: "ФИО", enableSorting: true },
    { accessorKey: "department", header: "Отдел", enableSorting: true },
    {
      accessorKey: "created_at",
      header: "Дата создания",
      enableSorting: true,
      cell: ({ getValue }) => formatDateTime(getValue<string>(), "date"),
    },
    {
      id: "actions",
      header: "",
      size: 80,
      enableSorting: false,
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
      isContentWithoutPadding
      title="Ответственные по счетам-фактурам"
      subtitle={
        <ResponsibleFiltersBar filters={filters} onChange={setFilters} />
      }
      actions={<Flex gap={2}><RefetchButton onClick={refetch} isFetching={isFetching} /><CreateResponsibleButton onSuccess={refetch} /></Flex>}
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

      {editItem && (
        <EditResponsibleDrawer
          item={editItem}
          isOpen={true}
          onClose={() => setEditItem(null)}
          onSuccess={refetch}
        />
      )}

      <Dialog.Root
        open={!!deleteItem}
        onOpenChange={(e) => {
          if (!e.open) setDeleteItem(null);
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Удалить ответственного?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Ответственный <strong>{deleteItem?.full_name}</strong> будет
                  удалён без возможности восстановления.
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
