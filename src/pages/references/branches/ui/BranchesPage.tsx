import { useState } from "react";
import type { ColumnDef, SortingState, OnChangeFn } from "@tanstack/react-table";
import { Box, Badge, Flex, IconButton } from "@chakra-ui/react";
import { LuPencil } from "react-icons/lu";
import { MainLayout } from "@widgets/main-layout";
import { DataTable, RefetchButton } from "@shared/ui";
import {
  useGetBranchesQuery,
  type BranchItem,
  type BranchFilters,
} from "@entities/branch";
import { BranchesFilters } from "@widgets/branches-filters";
import { CreateBranchButton, EditBranchDrawer } from "@widgets/create-branch";
import { formatDateTime } from "@shared/lib";

export const BranchesPage = () => {
  const [filters, setFilters] = useState<Omit<BranchFilters, "sort_by" | "sort_order">>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editItem, setEditItem] = useState<BranchItem | null>(null);

  const queryFilters: BranchFilters = {
    ...filters,
    ...(sorting[0] && { sort_by: sorting[0].id, sort_order: sorting[0].desc ? "DESC" : "ASC" }),
  };

  const { data, currentData, isFetching, refetch } =
    useGetBranchesQuery(queryFilters);
  const isLoading = isFetching && !currentData;

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  const columns: ColumnDef<BranchItem>[] = [
    { accessorKey: "code", header: "Код", enableSorting: true },
    { accessorKey: "name", header: "Наименование", enableSorting: true },
    { accessorKey: "address", header: "Адрес", enableSorting: true },
    { accessorKey: "inn", header: "ИНН", enableSorting: true },
    { accessorKey: "kpp", header: "КПП", enableSorting: true },
    {
      accessorKey: "auto_confirm",
      header: "Автоподтверждение",
      enableSorting: true,
      cell: ({ getValue }) =>
        getValue<boolean>() ? (
          <Badge colorPalette="green">Да</Badge>
        ) : (
          <Badge colorPalette="gray">Нет</Badge>
        ),
    },
    {
      accessorKey: "created_at",
      header: "Дата создания",
      enableSorting: true,
      cell: ({ getValue }) => formatDateTime(getValue<string>(), "date"),
    },
    {
      id: "actions",
      header: "",
      size: 50,
      enableSorting: false,
      cell: ({ row }) => (
        <Flex justify="flex-end">
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Редактировать"
            onClick={() => setEditItem(row.original)}
          >
            <LuPencil />
          </IconButton>
        </Flex>
      ),
    },
  ];

  return (
    <MainLayout
      isContentWithoutPadding
      title="Отделения"
      subtitle={<BranchesFilters filters={filters} onChange={setFilters} />}
      actions={<Flex gap={2}><RefetchButton onClick={refetch} isFetching={isFetching} /><CreateBranchButton onSuccess={refetch} /></Flex>}
    >
      <Box height="100%" display="flex" flexDirection="column">
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
          isFetching={isFetching}
          hasNextPage={false}
          onFetchNextPage={() => {}}
          sorting={sorting}
          onSortingChange={handleSortingChange}
        />
      </Box>

      {editItem && (
        <EditBranchDrawer
          item={editItem}
          isOpen={true}
          onClose={() => setEditItem(null)}
          onSuccess={refetch}
        />
      )}
    </MainLayout>
  );
};
